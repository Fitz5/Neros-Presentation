import type { Block, Deck, Slide, Step } from "./schema";

export interface RenderedSlide {
  id: string;
  sourceSlideId: string;
  sequenceNumber: number;
  totalSlides: number;
  sectionId: string;
  title: string;
  subtitle?: string;
  layout: Slide["layout"];
  composition: NonNullable<Slide["composition"]>;
  step?: Step;
  stepIndex: number;
  stepCount: number;
  estimatedMinutes?: number;
  blocks: Block[];
  notes: string[];
}

export function expandDeck(deck: Deck): RenderedSlide[] {
  const expanded = deck.slides.flatMap((slide) => expandSlide(slide));

  return expanded.map((slide, index) => ({
    ...slide,
    sequenceNumber: index + 1,
    totalSlides: expanded.length,
  }));
}

function expandSlide(slide: Slide): Omit<RenderedSlide, "sequenceNumber" | "totalSlides">[] {
  const steps = slide.steps ?? [];

  if (steps.length === 0) {
    return [
      {
        id: slide.id,
        sourceSlideId: slide.id,
        sectionId: slide.sectionId,
        title: slide.title,
        subtitle: slide.subtitle,
        layout: slide.layout,
        composition: slide.composition ?? defaultComposition(slide.layout),
        stepIndex: 0,
        stepCount: 1,
        estimatedMinutes: slide.estimatedMinutes,
        blocks: slide.blocks,
        notes: slide.notes ?? [],
      },
    ];
  }

  return steps.map((step, index) => ({
    id: `${slide.id}--${step.id}`,
    sourceSlideId: slide.id,
    sectionId: slide.sectionId,
    title: slide.title,
    subtitle: slide.subtitle,
    layout: slide.layout,
    composition: step.composition ?? slide.composition ?? defaultComposition(slide.layout),
    step,
    stepIndex: index,
    stepCount: steps.length,
    estimatedMinutes: slide.estimatedMinutes,
    blocks: filterBlocks(slide.blocks, steps, index),
    notes: [...(slide.notes ?? []), ...(step.notes ?? [])],
  }));
}

function filterBlocks(blocks: Block[], steps: Step[], activeStepIndex: number) {
  return blocks
    .map((block) => filterBlock(block, steps, activeStepIndex))
    .filter((block): block is Block => block !== null);
}

function filterBlock(block: Block, steps: Step[], activeStepIndex: number): Block | null {
  if (!isVisible(block.showAt, steps, activeStepIndex)) {
    return null;
  }

  switch (block.type) {
    case "bullets": {
      const items = block.items.filter((item) => isVisible(item.showAt, steps, activeStepIndex));
      return items.length > 0 ? { ...block, items } : null;
    }
    case "twoColumn": {
      const columns = block.columns.map((column) => ({
        ...column,
        items: column.items.filter((item) => isVisible(item.showAt, steps, activeStepIndex)),
      }));
      return columns.some((column) => column.items.length > 0) ? { ...block, columns } : null;
    }
    case "metricRow": {
      const metrics = block.metrics.filter((metric) => isVisible(metric.showAt, steps, activeStepIndex));
      return metrics.length > 0 ? { ...block, metrics } : null;
    }
    case "timeline": {
      const items = block.items.filter((item) => isVisible(item.showAt, steps, activeStepIndex));
      return items.length > 0 ? { ...block, items } : null;
    }
    case "headline":
    case "callout":
    case "quote":
    case "image":
    case "checkpoint":
      return block;
  }
}

function defaultComposition(layout: Slide["layout"]): NonNullable<Slide["composition"]> {
  switch (layout) {
    case "comparison":
      return "mediaAnalysis";
    case "timeline":
      return "timeline";
    case "title":
    case "closing":
      return "centered";
    case "content":
    default:
      return "default";
  }
}

function isVisible(showAt: string | undefined, steps: Step[], activeStepIndex: number) {
  if (!showAt) {
    return true;
  }

  const revealIndex = steps.findIndex((step) => step.id === showAt);
  return revealIndex >= 0 && revealIndex <= activeStepIndex;
}
