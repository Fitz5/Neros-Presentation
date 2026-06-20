import { describe, expect, it } from "vitest";
import { validateDeck, type DeckInput } from "./schema";

const validDeck = {
  meta: {
    title: "Test Deck",
    durationMinutes: 45,
  },
  sections: [{ id: "one", title: "One", shortTitle: "One" }],
  slides: [
    {
      id: "intro",
      sectionId: "one",
      title: "Intro",
      layout: "content",
      blocks: [
        {
          type: "bullets",
          items: [{ id: "point", text: "Point" }],
        },
      ],
    },
  ],
} satisfies DeckInput;

describe("validateDeck", () => {
  it("accepts a valid deck", () => {
    expect(validateDeck(validDeck).slides).toHaveLength(1);
  });

  it("accepts the six stages used by the technical progress rail", () => {
    const sections = Array.from({ length: 6 }, (_, index) => ({
      id: `section-${index + 1}`,
      title: `Section ${index + 1}`,
      shortTitle: `Section ${index + 1}`,
    }));

    expect(
      validateDeck({
        ...validDeck,
        sections,
        slides: [{ ...validDeck.slides[0], sectionId: sections[0].id }],
      }).sections,
    ).toHaveLength(6);
  });

  it("rejects unknown section references", () => {
    expect(() =>
      validateDeck({
        ...validDeck,
        slides: [{ ...validDeck.slides[0], sectionId: "missing" }],
      }),
    ).toThrow('Slide "intro" references unknown section "missing".');
  });

  it("rejects unknown build step references", () => {
    expect(() =>
      validateDeck({
        ...validDeck,
        slides: [
          {
            ...validDeck.slides[0],
            steps: [{ id: "first", label: "First" }],
            blocks: [
              {
                type: "bullets",
                items: [{ id: "point", text: "Point", showAt: "missing" }],
              },
            ],
          },
        ],
      }),
    ).toThrow('Slide "intro" references unknown step "missing".');
  });

  it("accepts requirement and failure metric variants with optional labels", () => {
    const parsed = validateDeck({
      ...validDeck,
      slides: [
        {
          ...validDeck.slides[0],
          blocks: [
            {
              type: "metricRow",
              variant: "requirements",
              metrics: [
                { id: "speed", value: "70 mph", label: "Top speed" },
                { id: "reliable", value: "Reliable", emphasis: true },
              ],
            },
            {
              type: "metricRow",
              variant: "failures",
              metrics: [
                { id: "jello", value: "Camera Jello" },
                { id: "motors", value: "Hot Motors" },
              ],
            },
          ],
        },
      ],
    });

    const requirementBlock = parsed.slides[0]?.blocks[0];
    expect(requirementBlock?.type).toBe("metricRow");
    if (requirementBlock?.type === "metricRow") {
      expect(requirementBlock.variant).toBe("requirements");
      expect(requirementBlock.metrics[1]?.label).toBeUndefined();
      expect(requirementBlock.metrics[1]?.emphasis).toBe(true);
    }
  });
});
