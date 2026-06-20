import { describe, expect, it } from "vitest";
import { deck } from "./content";
import { expandDeck } from "./expand";
import { validateDeck, type DeckInput } from "./schema";

describe("expandDeck", () => {
  it("numbers the authored deck from start to finish", () => {
    const rendered = expandDeck(validateDeck(deck));

    expect(rendered.length).toBeGreaterThanOrEqual(deck.slides.length);
    expect(rendered[0].sequenceNumber).toBe(1);
    expect(rendered.at(-1)?.totalSlides).toBe(rendered.length);
  });

  it("keeps the timed main narrative at 26 slides before the appendix", () => {
    const rendered = expandDeck(validateDeck(deck));
    const qaIndex = rendered.findIndex((slide) => slide.id === "qa");

    expect(qaIndex).toBe(25);
    expect(rendered[qaIndex + 1]?.id).toBe("appendix-divider");
  });

  it("reveals step content cumulatively", () => {
    const stepDeck = {
      meta: {
        title: "Build Test",
        durationMinutes: 10,
      },
      sections: [{ id: "one", title: "One", shortTitle: "One" }],
      slides: [
        {
          id: "build",
          sectionId: "one",
          title: "Build",
          layout: "content",
          steps: [
            { id: "first", label: "First" },
            { id: "second", label: "Second" },
          ],
          blocks: [
            {
              type: "bullets",
              items: [
                { id: "a", text: "A", showAt: "first" },
                { id: "b", text: "B", showAt: "second" },
              ],
            },
          ],
        },
      ],
    } satisfies DeckInput;

    const rendered = expandDeck(validateDeck(stepDeck));
    const firstItems = rendered[0].blocks[0]?.type === "bullets" ? rendered[0].blocks[0].items : [];
    const secondItems = rendered[1].blocks[0]?.type === "bullets" ? rendered[1].blocks[0].items : [];

    expect(firstItems.map((item) => item.id)).toEqual(["a"]);
    expect(secondItems.map((item) => item.id)).toEqual(["a", "b"]);
  });
});
