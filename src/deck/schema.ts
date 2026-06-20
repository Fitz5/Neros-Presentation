import { z } from "zod";

const idSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9-]*$/, "Use lowercase ids with hyphens.");

const textSizeSchema = z.enum(["support", "medium", "large"]);
const compositionSchema = z.enum([
  "default",
  "cover",
  "metricGrid",
  "mediaStackRight",
  "diagram",
  "diagramCards",
  "checkpoint",
  "dualMedia",
  "equationGrid",
  "mediaAnalysis",
  "twoColumn",
  "mediaRight",
  "timeline",
  "centered",
]);

const buildable = {
  showAt: idSchema.optional(),
  textSize: textSizeSchema.optional(),
};

const toneSchema = z.enum([
  "neutral",
  "accent",
  "success",
  "warning",
  "danger",
]);

const equationPartSchema = z.object({
  text: z.string().min(1),
  script: z.enum(["sub", "super"]).optional(),
});

const bulletItemSchema = z.object({
  id: idSchema,
  text: z.string().min(1),
  detail: z.string().optional(),
  equation: z.array(equationPartSchema).min(1).optional(),
  detailEquation: z.array(equationPartSchema).min(1).optional(),
  ...buildable,
});

const headlineBlockSchema = z.object({
  type: z.literal("headline"),
  eyebrow: z.string().optional(),
  text: z.string().min(1),
  subtext: z.string().optional(),
  ...buildable,
});

const bulletsBlockSchema = z.object({
  type: z.literal("bullets"),
  title: z.string().optional(),
  tone: toneSchema.optional(),
  items: z.array(bulletItemSchema).min(1),
  ...buildable,
});

const twoColumnBlockSchema = z.object({
  type: z.literal("twoColumn"),
  columns: z
    .array(
      z.object({
        title: z.string().min(1),
        items: z.array(bulletItemSchema).min(1),
      }),
    )
    .min(2)
    .max(2),
  ...buildable,
});

const metricSchema = z.object({
  id: idSchema,
  value: z.string().min(1),
  label: z.string().min(1).optional(),
  note: z.string().optional(),
  tone: toneSchema.optional(),
  emphasis: z.boolean().optional(),
  ...buildable,
});

const metricRowBlockSchema = z.object({
  type: z.literal("metricRow"),
  variant: z.enum(["default", "requirements", "failures"]).optional(),
  metrics: z.array(metricSchema).min(2).max(4),
  ...buildable,
});

const timelineItemSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  ...buildable,
});

const timelineBlockSchema = z.object({
  type: z.literal("timeline"),
  title: z.string().optional(),
  items: z.array(timelineItemSchema).min(2).max(6),
  ...buildable,
});

const calloutBlockSchema = z.object({
  type: z.literal("callout"),
  label: z.string().min(1),
  text: z.string().min(1),
  tone: toneSchema.optional(),
  ...buildable,
});

const quoteBlockSchema = z.object({
  type: z.literal("quote"),
  quote: z.string().min(1),
  attribution: z.string().optional(),
  ...buildable,
});

const imageBlockSchema = z.object({
  type: z.literal("image"),
  src: z.string().min(1),
  alt: z.string().min(1),
  title: z.string().optional(),
  caption: z.string().optional(),
  labels: z.tuple([z.string().min(1), z.string().min(1)]).optional(),
  aspectRatio: z.number().positive().optional(),
  ...buildable,
});

const checkpointBlockSchema = z.object({
  type: z.literal("checkpoint"),
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        id: idSchema,
        text: z.string().min(1),
        detail: z.string().optional(),
        state: z.enum(["complete", "current", "pending"]),
        ...buildable,
      }),
    )
    .length(3),
  ...buildable,
});

export const BlockSchema = z.discriminatedUnion("type", [
  headlineBlockSchema,
  bulletsBlockSchema,
  twoColumnBlockSchema,
  metricRowBlockSchema,
  timelineBlockSchema,
  calloutBlockSchema,
  quoteBlockSchema,
  imageBlockSchema,
  checkpointBlockSchema,
]);

export const SectionSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  shortTitle: z.string().min(1).max(18),
});

export const StepSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  composition: compositionSchema.optional(),
  notes: z.array(z.string()).optional(),
});

export const SlideSchema = z.object({
  id: idSchema,
  sectionId: idSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  layout: z.enum(["title", "content", "comparison", "timeline", "closing"]),
  composition: compositionSchema.optional(),
  estimatedMinutes: z.number().positive().optional(),
  steps: z.array(StepSchema).optional(),
  blocks: z.array(BlockSchema),
  notes: z.array(z.string()).optional(),
});

export const DeckSchema = z.object({
  meta: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    presenter: z.string().optional(),
    dateLabel: z.string().optional(),
    durationMinutes: z.number().positive(),
  }),
  sections: z.array(SectionSchema).min(1).max(6),
  slides: z.array(SlideSchema).min(1),
});

export type Deck = z.infer<typeof DeckSchema>;
export type DeckInput = z.input<typeof DeckSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Step = z.infer<typeof StepSchema>;
export type Slide = z.infer<typeof SlideSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type BulletItem = z.infer<typeof bulletItemSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type TimelineItem = z.infer<typeof timelineItemSchema>;

export function validateDeck(input: unknown): Deck {
  const parsed = DeckSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(formatZodIssues(parsed.error.issues));
  }

  const errors = getIntegrityErrors(parsed.data);

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return parsed.data;
}

function getIntegrityErrors(deck: Deck) {
  const errors: string[] = [];
  const sectionIds = new Set<string>();
  const slideIds = new Set<string>();

  for (const section of deck.sections) {
    if (sectionIds.has(section.id)) {
      errors.push(`Duplicate section id "${section.id}".`);
    }
    sectionIds.add(section.id);
  }

  for (const slide of deck.slides) {
    if (slideIds.has(slide.id)) {
      errors.push(`Duplicate slide id "${slide.id}".`);
    }
    slideIds.add(slide.id);

    if (!sectionIds.has(slide.sectionId)) {
      errors.push(
        `Slide "${slide.id}" references unknown section "${slide.sectionId}".`,
      );
    }

    const stepIds = new Set((slide.steps ?? []).map((step) => step.id));
    if ((slide.steps ?? []).length !== stepIds.size) {
      errors.push(`Slide "${slide.id}" contains duplicate step ids.`);
    }

    for (const showAt of collectShowAtRefs(slide.blocks)) {
      if (stepIds.size === 0) {
        errors.push(
          `Slide "${slide.id}" uses showAt "${showAt}" but has no steps.`,
        );
      } else if (!stepIds.has(showAt)) {
        errors.push(`Slide "${slide.id}" references unknown step "${showAt}".`);
      }
    }
  }

  return errors;
}

function collectShowAtRefs(blocks: Block[]) {
  const refs: string[] = [];

  for (const block of blocks) {
    if (block.showAt) {
      refs.push(block.showAt);
    }

    switch (block.type) {
      case "bullets":
        refs.push(
          ...block.items.flatMap((item) => (item.showAt ? [item.showAt] : [])),
        );
        break;
      case "twoColumn":
        refs.push(
          ...block.columns.flatMap((column) =>
            column.items.flatMap((item) => (item.showAt ? [item.showAt] : [])),
          ),
        );
        break;
      case "metricRow":
        refs.push(
          ...block.metrics.flatMap((metric) =>
            metric.showAt ? [metric.showAt] : [],
          ),
        );
        break;
      case "timeline":
        refs.push(
          ...block.items.flatMap((item) => (item.showAt ? [item.showAt] : [])),
        );
        break;
      case "headline":
      case "callout":
      case "quote":
      case "image":
      case "checkpoint":
        break;
    }
  }

  return refs;
}

function formatZodIssues(issues: z.core.$ZodIssue[]) {
  return issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "deck";
      return `${path}: ${issue.message}`;
    })
    .join("\n");
}
