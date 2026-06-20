import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import type PptxGenJS from "pptxgenjs";
import { expandDeck, type RenderedSlide } from "../deck/expand";
import { getProgressColor, getProgressMarker, getProgressState } from "../deck/progress";
import { validateDeck, type Block, type DeckInput, type Section } from "../deck/schema";
import { theme, toneColor } from "../deck/theme";

const require = createRequire(import.meta.url);
const PptxGen = require("pptxgenjs") as typeof PptxGenJS;

const page = {
  width: theme.ppt.width,
  height: theme.ppt.height,
  marginX: 0.42,
  headerY: 0.22,
  titleY: 0.78,
  contentY: 1.74,
  footerY: 7.08,
};

type Pptx = PptxGenJS;
type PptxSlide = ReturnType<Pptx["addSlide"]>;

export function createPptx(deckInput: DeckInput) {
  const deck = validateDeck(deckInput);
  const slides = expandDeck(deck);
  const pptx = new PptxGen();

  pptx.author = deck.meta.presenter ?? "Dash";
  pptx.company = "Neros";
  pptx.subject = deck.meta.subtitle ?? deck.meta.title;
  pptx.title = deck.meta.title;
  pptx.defineLayout({ name: "NEROS_WIDE", width: page.width, height: page.height });
  pptx.layout = "NEROS_WIDE";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
  };

  for (const renderedSlide of slides) {
    drawSlide(pptx, deck.sections, renderedSlide, deck.meta.durationMinutes);
  }

  return pptx;
}

export async function writeDeckToPptx(deckInput: DeckInput, outFile: string) {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  const pptx = createPptx(deckInput);
  await pptx.writeFile({ fileName: outFile });
}

function drawSlide(
  pptx: Pptx,
  sections: Section[],
  renderedSlide: RenderedSlide,
  durationMinutes: number,
) {
  const slide = pptx.addSlide();
  slide.background = { color: pptColor(theme.colors.paper) };

  if (["cover", "deck-title"].includes(renderedSlide.id)) {
    drawCover(pptx, slide, renderedSlide);
    if (renderedSlide.notes.length > 0) {
      slide.addNotes(renderedSlide.notes.join("\n\n"));
    }
    return;
  }

  drawProgressHeader(pptx, slide, sections, renderedSlide.sectionId);
  drawTitle(slide, renderedSlide);
  drawBlocks(pptx, slide, renderedSlide);
  drawFooter(slide, renderedSlide, durationMinutes);

  if (renderedSlide.notes.length > 0) {
    slide.addNotes(renderedSlide.notes.join("\n\n"));
  }
}

function drawCover(pptx: Pptx, slide: PptxSlide, renderedSlide: RenderedSlide) {
  const identity = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "headline" }> => block.type === "headline",
  );

  slide.addImage({
    path: resolvePublicAssetPath("/graphics/neros-title-background.png"),
    x: 0,
    y: 0,
    w: page.width,
    h: page.height,
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.72,
    y: 1.25,
    w: 0.07,
    h: 4.85,
    fill: { color: pptColor(theme.colors.nerosOrange) },
    line: { color: pptColor(theme.colors.nerosOrange) },
  });

  slide.addText(renderedSlide.title, {
    x: 1.12,
    y: 2.05,
    w: 9.4,
    h: 1.35,
    bold: true,
    breakLine: false,
    color: pptColor(theme.colors.ink),
    fit: "shrink",
    fontFace: "Aptos Display",
    fontSize: 43,
    margin: 0,
  });

  if (renderedSlide.subtitle) {
    slide.addText(renderedSlide.subtitle, {
      x: 1.14,
      y: 3.48,
      w: 8.5,
      h: 0.42,
      color: pptColor(theme.colors.muted),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 17,
      margin: 0,
    });
  }

  if (identity) {
    slide.addText(identity.text, {
      x: 1.14,
      y: 5.68,
      w: 4.4,
      h: 0.3,
      bold: true,
      color: pptColor(theme.colors.ink),
      fontFace: "Aptos",
      fontSize: 13,
      margin: 0,
    });

    if (identity.subtext) {
      slide.addText(identity.subtext, {
        x: 8.7,
        y: 5.68,
        w: 3.45,
        h: 0.3,
        align: "right",
        color: pptColor(theme.colors.muted),
        fontFace: "Aptos",
        fontSize: 12,
        margin: 0,
      });
    }
  }
}

function drawProgressHeader(
  pptx: Pptx,
  slide: PptxSlide,
  sections: Section[],
  activeSectionId: string,
) {
  const gap = 0.08;
  const width = (page.width - page.marginX * 2 - gap * (sections.length - 1)) / sections.length;
  sections.forEach((section, index) => {
    const x = page.marginX + index * (width + gap);
    const state = getProgressState(sections, activeSectionId, index);
    const color = getProgressColor(state);
    const isActive = state === "active";
    const isComplete = state === "complete";
    const lineColor = isActive || isComplete ? color : theme.colors.faint;

    slide.addShape(pptx.ShapeType.rect, {
      x,
      y: page.headerY + 0.39,
      w: width,
      h: 0.03,
      fill: { color: pptColor(lineColor) },
      line: { color: pptColor(lineColor) },
    });

    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: page.headerY,
      w: 0.3,
      h: 0.3,
      fill: { color: pptColor(isActive || isComplete ? color : "#ECEFEB") },
      line: { color: pptColor(isActive || isComplete ? color : "#ECEFEB") },
    });

    slide.addText(getProgressMarker(index, state), {
      x: x + 0.02,
      y: page.headerY + 0.06,
      w: 0.26,
      h: 0.1,
      align: "center",
      bold: true,
      color: pptColor(isActive || isComplete ? "#FFFFFF" : theme.colors.muted),
      fontFace: "Aptos",
      fontSize: 5.5,
      margin: 0,
      valign: "middle",
    });

    slide.addText(section.shortTitle, {
      x: x + 0.38,
      y: page.headerY + 0.03,
      w: width - 0.38,
      h: 0.18,
      bold: true,
      color: pptColor(isActive ? theme.colors.ink : theme.colors.muted),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 8,
      margin: 0,
    });
  });
}

function drawTitle(slide: PptxSlide, renderedSlide: RenderedSlide) {
  slide.addText(renderedSlide.step?.label ?? "Neros Technical Interview", {
    x: page.marginX,
    y: page.titleY,
    w: 4.7,
    h: 0.18,
    bold: true,
    color: pptColor(theme.colors.accent),
    fit: "shrink",
    fontFace: "Aptos",
    fontSize: 8.5,
    margin: 0,
  });

  slide.addText(renderedSlide.title, {
    x: page.marginX,
    y: page.titleY + 0.22,
    w: 8.6,
    h: 0.48,
    bold: true,
    breakLine: false,
    color: pptColor(theme.colors.ink),
    fit: "shrink",
    fontFace: "Aptos Display",
    fontSize: 26,
    margin: 0,
  });

  if (renderedSlide.subtitle) {
    slide.addText(renderedSlide.subtitle, {
      x: page.marginX,
      y: page.titleY + 0.78,
      w: 8.6,
      h: 0.38,
      color: pptColor(theme.colors.muted),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 10,
      margin: 0,
      breakLine: false,
    });
  }
}

function drawBlocks(pptx: Pptx, slide: PptxSlide, renderedSlide: RenderedSlide) {
  if (renderedSlide.layout === "comparison" && renderedSlide.blocks[0]?.type === "image") {
    const contentY = 2.08;
    const contentWidth = page.width - page.marginX * 2;
    const largeReferenceImage = renderedSlide.id === "frame-resonance-expectation";
    const gap = largeReferenceImage ? 0.22 : 0.32;
    const leftWidth = largeReferenceImage ? 7.1 : 6.4;
    const rightX = page.marginX + leftWidth + gap;
    const rightWidth = contentWidth - leftWidth - gap;

    const flushImage = renderedSlide.id === "frame-resonance-expectation";
    const imageBlock = renderedSlide.blocks[0];
    const imageHeight = Math.min(4.0, leftWidth / (imageBlock.aspectRatio ?? 16 / 9));
    const imageTotalHeight = imageHeight + (imageBlock.caption ? 0.38 : 0);
    const imageY = flushImage ? contentY + Math.max(0, (4.38 - imageTotalHeight) / 2) : contentY;

    drawImage(pptx, slide, imageBlock, page.marginX, imageY, leftWidth, flushImage);

    const rightBlocks = renderedSlide.blocks.slice(1);
    const centerRight = ["spectral-evidence-rpm", "frame-resonance-expectation"].includes(
      renderedSlide.id,
    );
    const blockGap = centerRight ? 0.1 : 0.14;
    const rightHeight = rightBlocks.reduce((total, block, index) => {
      const titleHeight = block.type === "bullets" && block.title ? 0.42 : 0;
      const itemsHeight =
        block.type === "bullets"
          ? block.items.reduce((height, item) => height + 0.28 + (item.detail ? 0.36 : 0.12), 0)
          : 0;
      return total + titleHeight + itemsHeight + (index > 0 ? blockGap : 0);
    }, 0);
    let rightY = centerRight ? contentY + Math.max(0, (4.38 - rightHeight) / 2) : contentY;

    for (const block of rightBlocks) {
      const height = drawBlock(
        pptx,
        slide,
        block,
        rightX,
        rightY,
        rightWidth,
        renderedSlide.layout,
      );
      rightY += height + blockGap;
    }
    return;
  }

  let cursorY = renderedSlide.layout === "title" ? 2.18 : page.contentY;
  const contentWidth = page.width - page.marginX * 2;

  for (const block of renderedSlide.blocks) {
    const height = drawBlock(pptx, slide, block, page.marginX, cursorY, contentWidth, renderedSlide.layout);
    cursorY += height + 0.16;
  }
}

function drawBlock(
  pptx: Pptx,
  slide: PptxSlide,
  block: Block,
  x: number,
  y: number,
  w: number,
  layout: RenderedSlide["layout"],
) {
  switch (block.type) {
    case "headline":
      return drawHeadline(slide, block, x, y, w, layout);
    case "bullets":
      return drawBullets(pptx, slide, block, x, y, w);
    case "twoColumn":
      return drawTwoColumn(pptx, slide, block, x, y, w);
    case "metricRow":
      return drawMetricRow(pptx, slide, block, x, y, w);
    case "timeline":
      return drawTimeline(pptx, slide, block, x, y, w);
    case "callout":
      return drawCallout(pptx, slide, block, x, y, w);
    case "quote":
      return drawQuote(slide, block, x, y, w);
    case "image":
      return drawImage(pptx, slide, block, x, y, w);
  }
}

function drawHeadline(
  slide: PptxSlide,
  block: Extract<Block, { type: "headline" }>,
  x: number,
  y: number,
  w: number,
  layout: RenderedSlide["layout"],
) {
  const isTitle = layout === "title" || layout === "closing";
  const headlineSize = isTitle ? 25 : 20;
  let cursorY = y;

  if (block.eyebrow) {
    slide.addText(block.eyebrow, {
      x,
      y: cursorY,
      w: 4,
      h: 0.18,
      bold: true,
      color: pptColor(theme.colors.coral),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 8,
      margin: 0,
    });
    cursorY += 0.26;
  }

  slide.addText(block.text, {
    x,
    y: cursorY,
    w: Math.min(w, isTitle ? 7.3 : 8.2),
    h: isTitle ? 1.15 : 0.82,
    bold: true,
    breakLine: false,
    color: pptColor(theme.colors.ink),
    fit: "shrink",
    fontFace: "Aptos Display",
    fontSize: headlineSize,
    margin: 0,
  });
  cursorY += isTitle ? 1.2 : 0.9;

  if (block.subtext) {
    slide.addText(block.subtext, {
      x,
      y: cursorY,
      w: Math.min(w, 8.5),
      h: 0.52,
      color: pptColor(theme.colors.muted),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 10.5,
      margin: 0,
    });
    cursorY += 0.58;
  }

  return cursorY - y;
}

function drawBullets(
  pptx: Pptx,
  slide: PptxSlide,
  block: Extract<Block, { type: "bullets" }>,
  x: number,
  y: number,
  w: number,
) {
  let cursorY = y;
  const color = toneColor(block.tone);

  if (block.title) {
    slide.addText(block.title, {
      x,
      y: cursorY,
      w,
      h: 0.28,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 13,
      margin: 0,
    });
    cursorY += 0.42;
  }

  for (const item of block.items) {
    if (!item.equation) {
      slide.addShape(pptx.ShapeType.ellipse, {
        x,
        y: cursorY + 0.08,
        w: 0.09,
        h: 0.09,
        fill: { color: pptColor(color) },
        line: { color: pptColor(color) },
      });
    }

    const equationRuns = item.equation?.map((part) => ({
      text: part.text,
      options: {
        subscript: part.script === "sub",
        superscript: part.script === "super",
      },
    }));

    slide.addText(equationRuns ?? item.text, {
      x: item.equation ? x : x + 0.2,
      y: cursorY,
      w: item.equation ? w : w - 0.2,
      h: 0.25,
      bold: !item.equation,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: item.equation ? "Cambria Math" : "Aptos",
      fontSize: item.equation ? 14 : 12,
      margin: 0,
    });
    cursorY += 0.28;

    if (item.detail) {
      const detailRuns = item.detailEquation?.map((part) => ({
        text: part.text,
        options: {
          subscript: part.script === "sub",
          superscript: part.script === "super",
        },
      }));

      slide.addText(detailRuns ?? item.detail, {
        x: item.equation ? x : x + 0.2,
        y: cursorY,
        w: item.equation ? w : w - 0.2,
        h: 0.3,
        color: pptColor(item.detailEquation ? theme.colors.ink : theme.colors.muted),
        fit: "shrink",
        fontFace: item.detailEquation ? "Cambria Math" : "Aptos",
        fontSize: item.detailEquation ? 12 : 9,
        margin: 0,
      });
      cursorY += 0.36;
    } else {
      cursorY += 0.12;
    }
  }

  return cursorY - y;
}

function drawTwoColumn(
  pptx: Pptx,
  slide: PptxSlide,
  block: Extract<Block, { type: "twoColumn" }>,
  x: number,
  y: number,
  w: number,
) {
  const gap = 0.18;
  const columnWidth = (w - gap) / 2;
  const maxItems = Math.max(...block.columns.map((column) => column.items.length));
  const height = Math.max(1.95, 0.64 + maxItems * 0.54);

  block.columns.forEach((column, index) => {
    const columnX = x + index * (columnWidth + gap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: columnX,
      y,
      w: columnWidth,
      h: height,
      rectRadius: 0.08,
      fill: { color: pptColor(theme.colors.surface), transparency: 12 },
      line: { color: pptColor(theme.colors.faint), transparency: 0 },
    });

    slide.addShape(pptx.ShapeType.rect, {
      x: columnX + 0.16,
      y: y + 0.2,
      w: 0.06,
      h: height - 0.4,
      fill: { color: pptColor(index === 0 ? theme.colors.indigo : theme.colors.accent) },
      line: { color: pptColor(index === 0 ? theme.colors.indigo : theme.colors.accent) },
    });

    slide.addText(column.title, {
      x: columnX + 0.34,
      y: y + 0.2,
      w: columnWidth - 0.52,
      h: 0.28,
      bold: true,
      color: pptColor(index === 0 ? theme.colors.indigo : theme.colors.accent),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 12,
      margin: 0,
    });

    let itemY = y + 0.64;
    for (const item of column.items) {
      slide.addText(item.text, {
        x: columnX + 0.34,
        y: itemY,
        w: columnWidth - 0.52,
        h: 0.2,
        bold: true,
        color: pptColor(theme.colors.ink),
        fit: "shrink",
        fontFace: "Aptos",
        fontSize: 10.5,
        margin: 0,
      });
      itemY += 0.24;

      if (item.detail) {
        slide.addText(item.detail, {
          x: columnX + 0.34,
          y: itemY,
          w: columnWidth - 0.52,
          h: 0.24,
          color: pptColor(theme.colors.muted),
          fit: "shrink",
          fontFace: "Aptos",
          fontSize: 8.5,
          margin: 0,
        });
        itemY += 0.32;
      } else {
        itemY += 0.16;
      }
    }
  });

  return height;
}

function drawMetricRow(
  pptx: Pptx,
  slide: PptxSlide,
  block: Extract<Block, { type: "metricRow" }>,
  x: number,
  y: number,
  w: number,
) {
  const gap = 0.16;
  const metricWidth = (w - gap * (block.metrics.length - 1)) / block.metrics.length;
  const height = 1.24;

  block.metrics.forEach((metric, index) => {
    const color = toneColor(metric.tone);
    const metricX = x + index * (metricWidth + gap);

    slide.addShape(pptx.ShapeType.roundRect, {
      x: metricX,
      y,
      w: metricWidth,
      h: height,
      rectRadius: 0.08,
      fill: { color: pptColor(theme.colors.surface) },
      line: { color: pptColor(color), transparency: 30 },
    });

    slide.addText(metric.value, {
      x: metricX + 0.16,
      y: y + 0.16,
      w: metricWidth - 0.32,
      h: 0.42,
      bold: true,
      color: pptColor(color),
      fit: "shrink",
      fontFace: "Aptos Display",
      fontSize: 24,
      margin: 0,
    });

    slide.addText(metric.label, {
      x: metricX + 0.16,
      y: y + 0.68,
      w: metricWidth - 0.32,
      h: 0.26,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 9,
      margin: 0,
    });

    if (metric.note) {
      slide.addText(metric.note, {
        x: metricX + 0.16,
        y: y + 0.94,
        w: metricWidth - 0.32,
        h: 0.18,
        color: pptColor(theme.colors.muted),
        fit: "shrink",
        fontFace: "Aptos",
        fontSize: 7,
        margin: 0,
      });
    }
  });

  return height;
}

function drawTimeline(
  pptx: Pptx,
  slide: PptxSlide,
  block: Extract<Block, { type: "timeline" }>,
  x: number,
  y: number,
  w: number,
) {
  let cursorY = y;

  if (block.title) {
    slide.addText(block.title, {
      x,
      y: cursorY,
      w,
      h: 0.28,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 13,
      margin: 0,
    });
    cursorY += 0.42;
  }

  const gap = 0.12;
  const itemWidth = (w - gap * (block.items.length - 1)) / block.items.length;
  const height = 1.46;

  block.items.forEach((item, index) => {
    const itemX = x + index * (itemWidth + gap);

    slide.addShape(pptx.ShapeType.rect, {
      x: itemX,
      y: cursorY,
      w: itemWidth,
      h: 0.04,
      fill: { color: pptColor(index % 2 === 0 ? theme.colors.accent : theme.colors.coral) },
      line: { color: pptColor(index % 2 === 0 ? theme.colors.accent : theme.colors.coral) },
    });

    slide.addText(item.label, {
      x: itemX,
      y: cursorY + 0.18,
      w: itemWidth,
      h: 0.2,
      bold: true,
      color: pptColor(theme.colors.coral),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 8,
      margin: 0,
    });

    slide.addText(item.title, {
      x: itemX,
      y: cursorY + 0.44,
      w: itemWidth,
      h: 0.28,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 10,
      margin: 0,
    });

    if (item.description) {
      slide.addText(item.description, {
        x: itemX,
        y: cursorY + 0.78,
        w: itemWidth,
        h: 0.5,
        color: pptColor(theme.colors.muted),
        fit: "shrink",
        fontFace: "Aptos",
        fontSize: 8,
        margin: 0,
      });
    }
  });

  return cursorY - y + height;
}

function drawCallout(
  pptx: Pptx,
  slide: PptxSlide,
  block: Extract<Block, { type: "callout" }>,
  x: number,
  y: number,
  w: number,
) {
  const color = toneColor(block.tone);
  const height = 0.98;

  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w: Math.min(w, 9.2),
    h: height,
    rectRadius: 0.08,
    fill: { color: pptColor(color), transparency: 88 },
    line: { color: pptColor(color), transparency: 18 },
  });

  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.08,
    h: height,
    fill: { color: pptColor(color) },
    line: { color: pptColor(color) },
  });

  slide.addText(block.label, {
    x: x + 0.22,
    y: y + 0.14,
    w: Math.min(w, 8.8),
    h: 0.18,
    bold: true,
    color: pptColor(color),
    fit: "shrink",
    fontFace: "Aptos",
    fontSize: 8,
    margin: 0,
  });

  slide.addText(block.text, {
    x: x + 0.22,
    y: y + 0.38,
    w: Math.min(w, 8.8),
    h: 0.42,
    bold: true,
    color: pptColor(theme.colors.ink),
    fit: "shrink",
    fontFace: "Aptos",
    fontSize: 11.5,
    margin: 0,
  });

  return height;
}

function drawQuote(slide: PptxSlide, block: Extract<Block, { type: "quote" }>, x: number, y: number, w: number) {
  slide.addShape("rect", {
    x,
    y,
    w: 0.05,
    h: 0.84,
    fill: { color: pptColor(theme.colors.gold) },
    line: { color: pptColor(theme.colors.gold) },
  });

  slide.addText(block.quote, {
    x: x + 0.22,
    y,
    w: Math.min(w, 8),
    h: 0.48,
    color: pptColor(theme.colors.ink),
    fit: "shrink",
    fontFace: "Aptos",
    fontSize: 13,
    italic: true,
    margin: 0,
  });

  if (block.attribution) {
    slide.addText(block.attribution, {
      x: x + 0.22,
      y: y + 0.58,
      w: Math.min(w, 8),
      h: 0.2,
      color: pptColor(theme.colors.muted),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 8,
      margin: 0,
    });
  }

  return 0.9;
}

function drawImage(
  pptx: Pptx,
  slide: PptxSlide,
  block: Extract<Block, { type: "image" }>,
  x: number,
  y: number,
  w: number,
  flush = false,
) {
  let cursorY = y;
  const aspectRatio = block.aspectRatio ?? 16 / 9;
  const imageWidth = Math.min(w, 10.35, 4.0 * aspectRatio);
  const imageHeight = imageWidth / aspectRatio;

  if (block.title) {
    slide.addText(block.title, {
      x,
      y: cursorY,
      w: imageWidth,
      h: 0.24,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 12,
      margin: 0,
    });
    cursorY += 0.34;
  }

  if (block.labels) {
    const gap = 0.08;
    const labelWidth = (imageWidth - gap) / 2;

    block.labels.forEach((label, index) => {
      const labelX = x + index * (labelWidth + gap);
      slide.addShape(pptx.ShapeType.roundRect, {
        x: labelX,
        y: cursorY,
        w: labelWidth,
        h: 0.24,
        rectRadius: 0.08,
        fill: { color: pptColor(theme.colors.accent), transparency: 88 },
        line: { color: pptColor(theme.colors.accent), transparency: 70 },
      });
      slide.addText(label.toUpperCase(), {
        x: labelX + 0.08,
        y: cursorY + 0.05,
        w: labelWidth - 0.16,
        h: 0.1,
        align: "center",
        bold: true,
        color: pptColor(theme.colors.accent),
        fit: "shrink",
        fontFace: "Aptos",
        fontSize: 7,
        margin: 0,
      });
    });
    cursorY += 0.32;
  }

  if (!flush) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: cursorY,
      w: imageWidth,
      h: imageHeight,
      rectRadius: 0.08,
      fill: { color: pptColor(theme.colors.surface) },
      line: { color: pptColor(theme.colors.faint) },
    });
  }

  slide.addImage({
    path: resolvePublicAssetPath(block.src),
    x: flush ? x : x + 0.06,
    y: flush ? cursorY : cursorY + 0.06,
    w: flush ? imageWidth : imageWidth - 0.12,
    h: flush ? imageHeight : imageHeight - 0.12,
  });

  if (block.caption) {
    slide.addText(block.caption, {
      x,
      y: cursorY + imageHeight + 0.12,
      w: imageWidth,
      h: 0.2,
      bold: true,
      color: pptColor(theme.colors.muted),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 7.5,
      margin: 0,
    });
    return cursorY - y + imageHeight + 0.38;
  }

  return cursorY - y + imageHeight;
}

function drawFooter(slide: PptxSlide, renderedSlide: RenderedSlide, durationMinutes: number) {
  slide.addText(`${durationMinutes} min technical interview`, {
    x: page.marginX,
    y: page.footerY,
    w: 3.6,
    h: 0.18,
    bold: true,
    color: pptColor("#7B8687"),
    fit: "shrink",
    fontFace: "Aptos",
    fontSize: 7,
    margin: 0,
  });

  slide.addText(`${renderedSlide.sequenceNumber}/${renderedSlide.totalSlides}`, {
    x: page.width - page.marginX - 0.72,
    y: page.footerY,
    w: 0.72,
    h: 0.18,
    align: "right",
    bold: true,
    color: pptColor("#7B8687"),
    fit: "shrink",
    fontFace: "Aptos",
    fontSize: 7,
    margin: 0,
  });
}

function pptColor(color: string) {
  return color.replace("#", "").toUpperCase();
}

function resolvePublicAssetPath(src: string) {
  const publicPath = src.startsWith("/") ? src.slice(1) : src;
  return path.resolve(process.cwd(), "public", publicPath);
}
