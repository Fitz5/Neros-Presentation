import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import type PptxGenJS from "pptxgenjs";
import { expandDeck, type RenderedSlide } from "../deck/expand";
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

  drawProgressHeader(pptx, slide, sections, renderedSlide.sectionId);
  drawTitle(slide, renderedSlide);
  drawBlocks(pptx, slide, renderedSlide);
  drawFooter(slide, renderedSlide, durationMinutes);

  if (renderedSlide.notes.length > 0) {
    slide.addNotes(renderedSlide.notes.join("\n\n"));
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
  const activeIndex = sections.findIndex((section) => section.id === activeSectionId);

  sections.forEach((section, index) => {
    const x = page.marginX + index * (width + gap);
    const color = getSectionColor(section.id);
    const isActive = section.id === activeSectionId;
    const isComplete = index < activeIndex;
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
      fill: { color: pptColor(isActive ? color : "#ECEFEB") },
      line: { color: pptColor(isActive ? color : "#ECEFEB") },
    });

    slide.addText(String(index + 1).padStart(2, "0"), {
      x: x + 0.02,
      y: page.headerY + 0.06,
      w: 0.26,
      h: 0.1,
      align: "center",
      bold: true,
      color: pptColor(isActive ? "#FFFFFF" : theme.colors.muted),
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
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: cursorY + 0.08,
      w: 0.09,
      h: 0.09,
      fill: { color: pptColor(color) },
      line: { color: pptColor(color) },
    });

    slide.addText(item.text, {
      x: x + 0.2,
      y: cursorY,
      w: w - 0.2,
      h: 0.25,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: 12,
      margin: 0,
    });
    cursorY += 0.28;

    if (item.detail) {
      slide.addText(item.detail, {
        x: x + 0.2,
        y: cursorY,
        w: w - 0.2,
        h: 0.3,
        color: pptColor(theme.colors.muted),
        fit: "shrink",
        fontFace: "Aptos",
        fontSize: 9,
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
) {
  let cursorY = y;
  const imageWidth = Math.min(w, 10.35);
  const imageHeight = Math.min(4.0, imageWidth / (block.aspectRatio ?? 16 / 9));

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

  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y: cursorY,
    w: imageWidth,
    h: imageHeight,
    rectRadius: 0.08,
    fill: { color: pptColor(theme.colors.surface) },
    line: { color: pptColor(theme.colors.faint) },
  });

  slide.addImage({
    path: resolvePublicAssetPath(block.src),
    x: x + 0.06,
    y: cursorY + 0.06,
    w: imageWidth - 0.12,
    h: imageHeight - 0.12,
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

function getSectionColor(sectionId: string) {
  switch (sectionId) {
    case "context":
      return theme.sections.context;
    case "architecture":
      return theme.sections.architecture;
    case "deep-dive":
      return theme.sections.deepDive;
    case "execution":
      return theme.sections.execution;
    case "discussion":
      return theme.sections.discussion;
    default:
      return theme.colors.accent;
  }
}

function pptColor(color: string) {
  return color.replace("#", "").toUpperCase();
}

function resolvePublicAssetPath(src: string) {
  const publicPath = src.startsWith("/") ? src.slice(1) : src;
  return path.resolve(process.cwd(), "public", publicPath);
}
