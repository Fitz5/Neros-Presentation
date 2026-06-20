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
});
