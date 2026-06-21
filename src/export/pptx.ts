import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import type PptxGenJS from "pptxgenjs";
import { expandDeck, type RenderedSlide } from "../deck/expand";
import {
  getProgressColor,
  getProgressMarker,
  getProgressState,
} from "../deck/progress";
import {
  validateDeck,
  type Block,
  type DeckInput,
  type Section,
} from "../deck/schema";
import { theme, toneColor } from "../deck/theme";

const require = createRequire(import.meta.url);
const PptxGen = require("pptxgenjs") as typeof PptxGenJS;

const page = {
  width: theme.ppt.width,
  height: theme.ppt.height,
  marginX: 0.42,
  headerY: 0.22,
  titleY: 0.78,
  contentY: 2.28,
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
  pptx.defineLayout({
    name: "NEROS_WIDE",
    width: page.width,
    height: page.height,
  });
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

  if (renderedSlide.composition === "cover" || renderedSlide.id === "cover") {
    drawCover(pptx, slide, renderedSlide, renderedSlide.id === "cover");
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

function drawCover(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
  useBackgroundImage: boolean,
) {
  const identity = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "headline" }> =>
      block.type === "headline",
  );

  if (useBackgroundImage) {
    slide.addImage({
      path: resolvePublicAssetPath("/graphics/neros-title-background.png"),
      x: 0,
      y: 0,
      w: page.width,
      h: page.height,
    });
  }

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
    w: useBackgroundImage ? 9.4 : 10.8,
    h: 1.35,
    bold: true,
    breakLine: false,
    color: pptColor(theme.colors.ink),
    fit: "shrink",
    fontFace: "Aptos Display",
    fontSize: theme.typography.display,
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
      fontSize: theme.typography.medium,
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
      fontSize: theme.typography.support,
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
        fontSize: theme.typography.support,
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
  const width =
    (page.width - page.marginX * 2 - gap * (sections.length - 1)) /
    sections.length;
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
      fontSize: theme.typography.chrome,
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
      fontSize: theme.typography.chrome,
      margin: 0,
    });
  });
}

function drawTitle(slide: PptxSlide, renderedSlide: RenderedSlide) {
  const hasKicker = Boolean(renderedSlide.step?.label);
  if (renderedSlide.step?.label) {
    slide.addText(renderedSlide.step.label, {
      x: page.marginX,
      y: page.titleY,
      w: 5.8,
      h: 0.34,
      bold: true,
      color: pptColor(theme.colors.accent),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
  }

  slide.addText(renderedSlide.title, {
    x: page.marginX,
    y: page.titleY + (hasKicker ? 0.4 : 0),
    w: page.width - page.marginX * 2,
    h: 0.78,
    bold: true,
    breakLine: false,
    color: pptColor(theme.colors.ink),
    fontFace: "Aptos Display",
    fontSize: theme.typography.title,
    margin: 0,
  });

  if (renderedSlide.subtitle) {
    slide.addText(renderedSlide.subtitle, {
      x: page.marginX,
      y: page.titleY + (hasKicker ? 1.22 : 0.82),
      w: page.width - page.marginX * 2,
      h: 0.58,
      color: pptColor(theme.colors.muted),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
      breakLine: false,
    });
  }
}

function drawBlocks(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
) {
  switch (renderedSlide.composition) {
    case "mediaStackRight":
      drawDroneComposition(pptx, slide, renderedSlide);
      return;
    case "diagram":
    case "diagramCards":
      drawDiagnosticComposition(pptx, slide, renderedSlide);
      return;
    case "checkpoint":
      drawCheckpointComposition(pptx, slide, renderedSlide);
      return;
    case "dualMedia":
      drawDualMediaComposition(pptx, slide, renderedSlide);
      return;
    case "equationGrid":
      drawEquationGridComposition(pptx, slide, renderedSlide);
      return;
    case "mediaRight":
      drawMechanicalResultComposition(pptx, slide, renderedSlide);
      return;
    case "metricGrid":
    case "cover":
    case "mediaAnalysis":
    case "twoColumn":
    case "timeline":
    case "centered":
    case "default":
      break;
  }

  if (
    renderedSlide.layout === "comparison" &&
    renderedSlide.blocks[0]?.type === "image"
  ) {
    const contentY = page.contentY;
    const contentWidth = page.width - page.marginX * 2;
    const gap = 0.3;
    const leftWidth = contentWidth * 0.6;
    const rightX = page.marginX + leftWidth + gap;
    const rightWidth = contentWidth - leftWidth - gap;

    const flushImage = false;
    const imageBlock = renderedSlide.blocks[0];
    const imageHeight = Math.min(
      4.0,
      leftWidth / (imageBlock.aspectRatio ?? 16 / 9),
    );
    const imageTotalHeight = imageHeight + (imageBlock.caption ? 0.38 : 0);
    const imageY = contentY + Math.max(0, (4.45 - imageTotalHeight) / 2);

    drawImage(
      pptx,
      slide,
      imageBlock,
      page.marginX,
      imageY,
      leftWidth,
      flushImage,
    );

    const rightBlocks = renderedSlide.blocks.slice(1);
    const blockGap = 0.18;
    let rightY = contentY;

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

  let cursorY =
    renderedSlide.composition === "metricGrid"
      ? renderedSlide.blocks.length === 1
        ? 3.12
        : 2.55
      : renderedSlide.layout === "title"
        ? 2.4
        : page.contentY;
  const contentWidth = page.width - page.marginX * 2;

  for (const block of renderedSlide.blocks) {
    const height = drawBlock(
      pptx,
      slide,
      block,
      page.marginX,
      cursorY,
      contentWidth,
      renderedSlide.layout,
    );
    cursorY += height + 0.16;
  }
}

function drawDroneComposition(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
) {
  const image = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "image" }> =>
      block.type === "image",
  );
  const specs = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "bullets" }> =>
      block.type === "bullets",
  );

  if (!image || !specs) return;

  const x = 4.35;
  const w = 8.55;
  const imageY = page.contentY;
  const imageH = 2.42;

  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y: imageY,
    w,
    h: imageH,
    rectRadius: 0.08,
    fill: { color: "FFFFFF" },
    line: { color: pptColor(theme.colors.faint) },
  });
  slide.addImage({
    path: resolvePublicAssetPath(image.src),
    x: x + 0.05,
    y: imageY + 0.05,
    w: w - 0.1,
    h: imageH - 0.1,
  });
  if (image.caption) {
    slide.addText(image.caption, {
      x,
      y: imageY + imageH + 0.07,
      w,
      h: 0.32,
      align: "right",
      bold: true,
      color: pptColor(theme.colors.muted),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
  }

  const panelY = 5.1;
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y: panelY,
    w,
    h: 1.75,
    rectRadius: 0.08,
    fill: { color: "FFFFFF", transparency: 10 },
    line: { color: pptColor(theme.colors.faint) },
  });
  slide.addText(specs.title ?? "Specifications", {
    x: x + 0.18,
    y: panelY + 0.14,
    w: w - 0.36,
    h: 0.34,
    bold: true,
    color: pptColor(theme.colors.ink),
    fontFace: "Aptos",
    fontSize: theme.typography.medium,
    margin: 0,
  });

  specs.items.forEach((item, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const itemX = x + 0.18 + column * 4.15;
    const itemY = panelY + 0.5 + row * 0.32;
    slide.addShape(pptx.ShapeType.ellipse, {
      x: itemX,
      y: itemY + 0.06,
      w: 0.07,
      h: 0.07,
      fill: { color: pptColor(theme.colors.accent) },
      line: { color: pptColor(theme.colors.accent) },
    });
    slide.addText(item.text, {
      x: itemX + 0.14,
      y: itemY,
      w: 3.86,
      h: 0.3,
      bold: true,
      color: pptColor(theme.colors.ink),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
  });
}

function drawDiagnosticComposition(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
) {
  const image = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "image" }> =>
      block.type === "image",
  );
  if (!image) return;

  if (renderedSlide.stepIndex === 0) {
    slide.addImage({
      path: resolvePublicAssetPath(image.src),
      x: 1.42,
      y: 2.82,
      w: 10.5,
      h: 3.14,
    });
    return;
  }

  slide.addImage({
    path: resolvePublicAssetPath(image.src),
    x: 3.42,
    y: page.contentY,
    w: 6.5,
    h: 1.94,
  });

  const timeline = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "timeline" }> =>
      block.type === "timeline",
  );
  if (!timeline) return;

  timeline.items.forEach((item, index) => {
    const x = 0.56 + index * 4.22;
    const y = 4.45;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.85,
      h: 2.12,
      rectRadius: 0.08,
      fill: { color: "FFFFFF", transparency: 12 },
      line: { color: pptColor(theme.colors.faint) },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x,
      y,
      w: 3.85,
      h: 0.06,
      fill: { color: pptColor(theme.colors.nerosOrange) },
      line: { color: pptColor(theme.colors.nerosOrange) },
    });
    slide.addText(item.label, {
      x: x + 0.22,
      y: y + 0.22,
      w: 0.65,
      h: 0.34,
      bold: true,
      color: pptColor(theme.colors.coral),
      fontFace: "Aptos Display",
      fontSize: theme.typography.support,
      margin: 0,
    });
    slide.addText(item.title, {
      x: x + 0.22,
      y: y + 0.62,
      w: 3.4,
      h: 0.42,
      bold: true,
      color: pptColor(theme.colors.ink),
      fontFace: "Aptos",
      fontSize: theme.typography.medium,
      margin: 0,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.22,
        y: y + 1.13,
        w: 3.4,
        h: 0.72,
        color: pptColor(theme.colors.muted),
        fontFace: "Aptos",
        fontSize: theme.typography.support,
        margin: 0,
      });
    }
  });
}

function drawCheckpointComposition(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
) {
  const progress = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "checkpoint" }> =>
      block.type === "checkpoint",
  );
  if (!progress) return;

  const x = page.marginX;
  const y = page.contentY + 0.3;
  const w = page.width - page.marginX * 2;
  const h = 3.7;
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: "E9EBE5" },
    line: { color: "E9EBE5" },
  });
  slide.addText(progress.title ?? "Progress:", {
    x: x + 0.35,
    y: y + 0.28,
    w: w - 0.7,
    h: 0.38,
    bold: true,
    color: pptColor(theme.colors.ink),
    fontFace: "Aptos Display",
    fontSize: theme.typography.medium,
    margin: 0,
  });
  progress.items.forEach((item, index) => {
    const gap = 0.22;
    const cardWidth = (w - 0.7 - gap * 2) / 3;
    const cardX = x + 0.35 + index * (cardWidth + gap);
    const stateColor =
      item.state === "complete"
        ? theme.colors.green
        : item.state === "current"
          ? theme.colors.nerosOrange
          : "#9AA6A5";
    const stateFill =
      item.state === "complete"
        ? "E7F1E9"
        : item.state === "current"
          ? "F8E9DF"
          : "F4F5F2";

    slide.addShape(pptx.ShapeType.roundRect, {
      x: cardX,
      y: y + 0.86,
      w: cardWidth,
      h: 2.35,
      rectRadius: 0.08,
      fill: { color: stateFill },
      line: { color: pptColor(stateColor) },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: cardX,
      y: y + 0.86,
      w: cardWidth,
      h: 0.07,
      fill: { color: pptColor(stateColor) },
      line: { color: pptColor(stateColor) },
    });
    slide.addText(
      item.state === "complete"
        ? "COMPLETE"
        : item.state === "current"
          ? "CURRENT"
          : "PENDING",
      {
        x: cardX + 0.22,
        y: y + 1.15,
        w: cardWidth - 0.44,
        h: 0.34,
        bold: true,
        color: pptColor(stateColor),
        fontFace: "Aptos",
        fontSize: theme.typography.support,
        margin: 0,
      },
    );
    slide.addText(item.text, {
      x: cardX + 0.22,
      y: y + 1.7,
      w: cardWidth - 0.44,
      h: 0.65,
      bold: true,
      color: pptColor(theme.colors.ink),
      fontFace: "Aptos Display",
      fontSize: theme.typography.large,
      margin: 0,
    });
  });
}

function drawDualMediaComposition(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
) {
  const images = renderedSlide.blocks.filter(
    (block): block is Extract<Block, { type: "image" }> => block.type === "image",
  );
  const mechanism = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "bullets" }> => block.type === "bullets",
  );
  if (images.length !== 2 || !mechanism) return;

  const gap = 0.28;
  const width = (page.width - page.marginX * 2 - gap) / 2;
  images.forEach((image, index) => {
    const imageX = page.marginX + index * (width + gap);
    const height = Math.min(2.95, width / (image.aspectRatio ?? 16 / 9));
    slide.addImage({
      path: resolvePublicAssetPath(image.src),
      x: imageX,
      y: page.contentY + (2.95 - height) / 2,
      w: width,
      h: height,
    });
  });

  drawBullets(
    pptx,
    slide,
    mechanism,
    page.marginX,
    5.48,
    page.width - page.marginX * 2,
  );
}

function drawEquationGridComposition(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
) {
  const metrics = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "metricRow" }> => block.type === "metricRow",
  );
  const equations = renderedSlide.blocks.filter(
    (block): block is Extract<Block, { type: "bullets" }> => block.type === "bullets",
  );
  if (!metrics || equations.length !== 2) return;

  drawMetricRow(
    pptx,
    slide,
    metrics,
    page.marginX,
    page.contentY,
    page.width - page.marginX * 2,
  );
  const gap = 0.28;
  const width = (page.width - page.marginX * 2 - gap) / 2;
  equations.forEach((equation, index) => {
    const x = page.marginX + index * (width + gap);
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 5.05,
      w: width,
      h: 1.6,
      rectRadius: 0.08,
      fill: { color: index === 0 ? "E6F1EF" : "F8E9DF" },
      line: { color: index === 0 ? "B7D6D1" : "E8C8B5" },
    });
    drawBullets(pptx, slide, equation, x + 0.22, 5.25, width - 0.44);
  });
}

function drawJelloComposition(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
) {
  const images = renderedSlide.blocks.filter(
    (block): block is Extract<Block, { type: "image" }> =>
      block.type === "image",
  );
  const bulletBlocks = renderedSlide.blocks.filter(
    (block): block is Extract<Block, { type: "bullets" }> =>
      block.type === "bullets",
  );
  const [rollingImage, sketchImage] = images;
  const [assumptions, mechanism, equations] = bulletBlocks;
  if (!rollingImage || !sketchImage || !assumptions || !mechanism || !equations)
    return;

  slide.addImage({
    path: resolvePublicAssetPath(rollingImage.src),
    x: 0.45,
    y: 1.68,
    w: 5.45,
    h: 2.73,
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.48,
    y: 1.62,
    w: 6.38,
    h: 0.78,
    rectRadius: 0.06,
    fill: { color: "FFFFFF", transparency: 8 },
    line: { color: pptColor(theme.colors.faint) },
  });
  slide.addText(assumptions.title ?? "Assumptions", {
    x: 6.65,
    y: 1.72,
    w: 1.25,
    h: 0.18,
    bold: true,
    color: pptColor(theme.colors.accent),
    fontFace: "Aptos",
    fontSize: theme.typography.support,
    margin: 0,
  });
  assumptions.items.forEach((item, index) => {
    const x = 7.95 + (index % 2) * 2.4;
    const y = 1.7 + Math.floor(index / 2) * 0.29;
    slide.addText(`• ${item.text}`, {
      x,
      y,
      w: 2.25,
      h: 0.18,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
  });

  slide.addImage({
    path: resolvePublicAssetPath(sketchImage.src),
    x: 6.48,
    y: 2.52,
    w: 6.38,
    h: 2.75,
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.45,
    y: 4.64,
    w: 5.45,
    h: 1.72,
    rectRadius: 0.06,
    fill: { color: "FFFFFF", transparency: 8 },
    line: { color: pptColor(theme.colors.faint) },
  });
  slide.addText(mechanism.title ?? "Physical mechanism", {
    x: 0.68,
    y: 4.84,
    w: 4.95,
    h: 0.25,
    bold: true,
    color: pptColor(theme.colors.ink),
    fontFace: "Aptos",
    fontSize: theme.typography.medium,
    margin: 0,
  });
  mechanism.items.forEach((item, index) => {
    slide.addText(`• ${item.text}`, {
      x: 0.72,
      y: 5.26 + index * 0.46,
      w: 4.9,
      h: 0.3,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.48,
    y: 5.4,
    w: 6.38,
    h: 1.25,
    rectRadius: 0.06,
    fill: { color: "E6F1EF" },
    line: { color: "B7D6D1" },
  });
  slide.addText(equations.title ?? "Waves per frame + phase aliasing", {
    x: 6.7,
    y: 5.55,
    w: 5.95,
    h: 0.2,
    bold: true,
    color: pptColor(theme.colors.accent),
    fontFace: "Aptos",
    fontSize: theme.typography.support,
    margin: 0,
  });
  equations.items.forEach((item, index) => {
    const x = 6.72 + index * 3;
    slide.addText(equationPartsToText(item.equation) || item.text, {
      x,
      y: 5.9,
      w: 2.78,
      h: 0.24,
      bold: true,
      color: pptColor(theme.colors.ink),
      fit: "shrink",
      fontFace: "Cambria Math",
      fontSize: theme.typography.support,
      margin: 0,
    });
    if (item.detail) {
      slide.addText(item.detail, {
        x,
        y: 6.2,
        w: 2.78,
        h: 0.2,
        color: pptColor(theme.colors.ink),
        fit: "shrink",
        fontFace: "Cambria Math",
        fontSize: theme.typography.support,
        margin: 0,
      });
    }
  });
}

function drawMechanicalResultComposition(
  pptx: Pptx,
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
) {
  const image = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "image" }> =>
      block.type === "image",
  );
  const changes = renderedSlide.blocks.find(
    (block): block is Extract<Block, { type: "bullets" }> =>
      block.type === "bullets",
  );
  if (!image || !changes) return;

  drawBullets(pptx, slide, changes, page.marginX, 3.05, 5.7);
  drawImage(pptx, slide, image, 7.45, page.contentY, 5.45);
}

function equationPartsToText(
  parts: Extract<Block, { type: "bullets" }>["items"][number]["equation"],
) {
  if (!parts) return "";
  return parts.map((part) => part.text).join("");
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
    case "checkpoint":
      return 0;
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
  const headlineSize = isTitle ? theme.typography.display : fontSizeFor(block, "large");
  let cursorY = y;

  if (block.eyebrow) {
    slide.addText(block.eyebrow, {
      x,
      y: cursorY,
      w: 4,
      h: 0.34,
      bold: true,
      color: pptColor(theme.colors.coral),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
    cursorY += 0.26;
  }

  slide.addText(block.text, {
    x,
    y: cursorY,
    w: Math.min(w, isTitle ? 10.5 : 11.8),
    h: isTitle ? 1.45 : 0.72,
    bold: true,
    breakLine: false,
    color: pptColor(theme.colors.ink),
    fontFace: "Aptos Display",
    fontSize: headlineSize,
    margin: 0,
  });
  cursorY += isTitle ? 1.5 : 0.82;

  if (block.subtext) {
    slide.addText(block.subtext, {
      x,
      y: cursorY,
      w: Math.min(w, 8.5),
      h: 0.68,
      color: pptColor(theme.colors.muted),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
    cursorY += 0.74;
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
  const bulletColor = theme.colors.nerosOrange;
  const primarySize = fontSizeFor(block, "medium");
  const detailSize = block.textSize === "large" ? theme.typography.medium : theme.typography.support;

  if (block.title) {
    slide.addText(block.title, {
      x,
      y: cursorY,
      w,
      h: 0.42,
      bold: true,
      color: pptColor(theme.colors.ink),
      fontFace: "Aptos",
      fontSize: primarySize,
      margin: 0,
    });
    cursorY += 0.52;
  }

  for (const item of block.items) {
    if (!item.equation) {
      slide.addShape(pptx.ShapeType.ellipse, {
        x,
        y: cursorY + 0.14,
        w: 0.11,
        h: 0.11,
        fill: { color: pptColor(bulletColor) },
        line: { color: pptColor(bulletColor) },
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
      h: 0.62,
      bold: !item.equation,
      color: pptColor(theme.colors.ink),
      fontFace: item.equation ? "Cambria Math" : "Aptos",
      fontSize: primarySize,
      margin: 0,
    });
    cursorY += 0.64;

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
        h: 0.62,
        color: pptColor(
          item.detailEquation ? theme.colors.ink : theme.colors.muted,
        ),
        fontFace: item.detailEquation ? "Cambria Math" : "Aptos",
        fontSize: detailSize,
        margin: 0,
      });
      cursorY += 0.68;
    } else {
      cursorY += 0.18;
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
  const maxItems = Math.max(
    ...block.columns.map((column) => column.items.length),
  );
  const height = Math.max(2.4, 0.85 + maxItems * 1.08);

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
      fill: {
        color: pptColor(
          index === 0 ? theme.colors.indigo : theme.colors.accent,
        ),
      },
      line: {
        color: pptColor(
          index === 0 ? theme.colors.indigo : theme.colors.accent,
        ),
      },
    });

    slide.addText(column.title, {
      x: columnX + 0.34,
      y: y + 0.2,
      w: columnWidth - 0.52,
      h: 0.42,
      bold: true,
      color: pptColor(index === 0 ? theme.colors.indigo : theme.colors.accent),
      fontFace: "Aptos",
      fontSize: fontSizeFor(block, "medium"),
      margin: 0,
    });

    let itemY = y + 0.78;
    for (const item of column.items) {
      slide.addText(item.text, {
        x: columnX + 0.34,
        y: itemY,
        w: columnWidth - 0.52,
        h: 0.46,
        bold: true,
        color: pptColor(theme.colors.ink),
        fontFace: "Aptos",
        fontSize: fontSizeFor(block, "medium"),
        margin: 0,
      });
      itemY += 0.48;

      if (item.detail) {
        slide.addText(item.detail, {
          x: columnX + 0.34,
          y: itemY,
          w: columnWidth - 0.52,
          h: 0.52,
          color: pptColor(theme.colors.muted),
          fontFace: "Aptos",
          fontSize: theme.typography.support,
          margin: 0,
        });
        itemY += 0.58;
      } else {
        itemY += 0.28;
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
  const metricWidth =
    (w - gap * (block.metrics.length - 1)) / block.metrics.length;
  const variant = block.variant ?? "default";
  const height =
    variant === "requirements" ? 2.15 : variant === "failures" ? 2.05 : 1.55;

  block.metrics.forEach((metric, index) => {
    const color =
      variant === "failures" ? theme.colors.coral : toneColor(metric.tone);
    const metricX = x + index * (metricWidth + gap);
    const fillColor =
      variant === "failures"
        ? "F8E8E3"
        : metric.emphasis
          ? "E8EAF1"
          : pptColor(theme.colors.surface);

    slide.addShape(pptx.ShapeType.roundRect, {
      x: metricX,
      y,
      w: metricWidth,
      h: height,
      rectRadius: 0.08,
      fill: { color: fillColor },
      line: { color: pptColor(color), transparency: 30 },
    });

    slide.addText(metric.value, {
      x: metricX + 0.16,
      y: y + (variant === "default" ? 0.24 : 0.42),
      w: metricWidth - 0.32,
      h: variant === "default" ? 0.52 : 0.78,
      align: variant === "default" ? "left" : "center",
      bold: true,
      color: pptColor(variant === "requirements" ? theme.colors.ink : color),
      fontFace: "Aptos Display",
      fontSize: theme.typography.large,
      margin: 0,
    });

    if (metric.label) {
      slide.addText(metric.label, {
        x: metricX + 0.16,
        y: y + (variant === "requirements" ? 1.32 : 0.82),
        w: metricWidth - 0.32,
        h: 0.42,
        align: variant === "requirements" ? "center" : "left",
        bold: true,
        color: pptColor(
          variant === "requirements" ? theme.colors.muted : theme.colors.ink,
        ),
        fontFace: "Aptos",
        fontSize: theme.typography.support,
        margin: 0,
      });
    }

    if (metric.note) {
      slide.addText(metric.note, {
        x: metricX + 0.16,
        y: y + (variant === "requirements" ? 1.72 : 1.18),
        w: metricWidth - 0.32,
        h: 0.38,
        color: pptColor(theme.colors.muted),
        fontFace: "Aptos",
        fontSize: theme.typography.support,
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
      h: 0.42,
      bold: true,
      color: pptColor(theme.colors.ink),
      fontFace: "Aptos",
      fontSize: fontSizeFor(block, "medium"),
      margin: 0,
    });
    cursorY += 0.52;
  }

  const gap = 0.18;
  const columns = Math.min(3, block.items.length);
  const rows = Math.ceil(block.items.length / columns);
  const itemWidth = (w - gap * (columns - 1)) / columns;
  const itemHeight = 1.92;
  const height = rows * itemHeight + (rows - 1) * gap;

  block.items.forEach((item, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const itemX = x + column * (itemWidth + gap);
    const itemY = cursorY + row * (itemHeight + gap);

    slide.addShape(pptx.ShapeType.rect, {
      x: itemX,
      y: itemY,
      w: itemWidth,
      h: 0.04,
      fill: { color: pptColor(theme.colors.nerosOrange) },
      line: { color: pptColor(theme.colors.nerosOrange) },
    });

    slide.addText(item.label, {
      x: itemX,
      y: itemY + 0.18,
      w: itemWidth,
      h: 0.34,
      bold: true,
      color: pptColor(theme.colors.coral),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });

    slide.addText(item.title, {
      x: itemX,
      y: itemY + 0.58,
      w: itemWidth,
      h: 0.44,
      bold: true,
      color: pptColor(theme.colors.ink),
      fontFace: "Aptos",
      fontSize: fontSizeFor(block, "medium"),
      margin: 0,
    });

    if (item.description) {
      slide.addText(item.description, {
        x: itemX,
        y: itemY + 1.08,
        w: itemWidth,
        h: 0.66,
        color: pptColor(theme.colors.muted),
        fontFace: "Aptos",
        fontSize: theme.typography.support,
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
  const height = 1.38;

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
    h: 0.34,
    bold: true,
    color: pptColor(color),
    fontFace: "Aptos",
    fontSize: theme.typography.support,
    margin: 0,
  });

  slide.addText(block.text, {
    x: x + 0.22,
    y: y + 0.56,
    w: Math.min(w, 8.8),
    h: 0.62,
    bold: true,
    color: pptColor(theme.colors.ink),
    fontFace: "Aptos",
    fontSize: fontSizeFor(block, "medium"),
    margin: 0,
  });

  return height;
}

function drawQuote(
  slide: PptxSlide,
  block: Extract<Block, { type: "quote" }>,
  x: number,
  y: number,
  w: number,
) {
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
    h: 0.68,
    color: pptColor(theme.colors.ink),
    fontFace: "Aptos",
    fontSize: fontSizeFor(block, "medium"),
    italic: true,
    margin: 0,
  });

  if (block.attribution) {
    slide.addText(block.attribution, {
      x: x + 0.22,
      y: y + 0.76,
      w: Math.min(w, 8),
      h: 0.38,
      color: pptColor(theme.colors.muted),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
  }

  return 1.2;
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
      h: 0.42,
      bold: true,
      color: pptColor(theme.colors.ink),
      fontFace: "Aptos",
      fontSize: fontSizeFor(block, "medium"),
      margin: 0,
    });
    cursorY += 0.5;
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
        h: 0.42,
        rectRadius: 0.08,
        fill: { color: pptColor(theme.colors.accent), transparency: 88 },
        line: { color: pptColor(theme.colors.accent), transparency: 70 },
      });
      slide.addText(label.toUpperCase(), {
        x: labelX + 0.08,
        y: cursorY + 0.06,
        w: labelWidth - 0.16,
        h: 0.28,
        align: "center",
        bold: true,
        color: pptColor(theme.colors.accent),
        fontFace: "Aptos",
        fontSize: theme.typography.support,
        margin: 0,
      });
    });
    cursorY += 0.5;
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
      h: 0.38,
      bold: true,
      color: pptColor(theme.colors.muted),
      fontFace: "Aptos",
      fontSize: theme.typography.support,
      margin: 0,
    });
    return cursorY - y + imageHeight + 0.56;
  }

  return cursorY - y + imageHeight;
}

function drawFooter(
  slide: PptxSlide,
  renderedSlide: RenderedSlide,
  durationMinutes: number,
) {
  slide.addText(`${durationMinutes} min technical interview`, {
    x: page.marginX,
    y: page.footerY,
    w: 3.6,
    h: 0.18,
    bold: true,
    color: pptColor("#7B8687"),
    fontFace: "Aptos",
    fontSize: theme.typography.chrome,
    margin: 0,
  });

  slide.addText(
    `${renderedSlide.sequenceNumber}/${renderedSlide.totalSlides}`,
    {
      x: page.width - page.marginX - 0.72,
      y: page.footerY,
      w: 0.72,
      h: 0.18,
      align: "right",
      bold: true,
      color: pptColor("#7B8687"),
      fontFace: "Aptos",
      fontSize: theme.typography.chrome,
      margin: 0,
    },
  );
}

function pptColor(color: string) {
  return color.replace("#", "").toUpperCase();
}

function fontSizeFor(
  block: { textSize?: "support" | "medium" | "large" },
  fallback: "support" | "medium" | "large",
) {
  return theme.typography[block.textSize ?? fallback];
}

function resolvePublicAssetPath(src: string) {
  const publicPath = src.startsWith("/") ? src.slice(1) : src;
  return path.resolve(process.cwd(), "public", publicPath);
}
