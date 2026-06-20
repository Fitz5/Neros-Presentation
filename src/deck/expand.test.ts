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

  it("closes the main narrative immediately before the appendix", () => {
    const rendered = expandDeck(validateDeck(deck));
    const qaIndex = rendered.findIndex((slide) => slide.id === "qa");

    expect(qaIndex).toBeGreaterThan(0);
    expect(rendered[qaIndex + 1]?.id).toBe("appendix-divider");
  });

  it("orders Objective before The Drone", () => {
    const rendered = expandDeck(validateDeck(deck));

    expect(rendered[1]?.id).toBe("objective");
    expect(rendered[2]?.id).toBe("drone");
  });

  it("renders the diagnostic diagram as two consecutive build states", () => {
    const rendered = expandDeck(validateDeck(deck));
    const diagnosticSlides = rendered.filter(
      (slide) => slide.sourceSlideId === "diagnostic-method",
    );

    expect(diagnosticSlides.map((slide) => slide.id)).toEqual([
      "diagnostic-method--system",
      "diagnostic-method--order",
    ]);
    expect(diagnosticSlides[0]?.blocks.map((block) => block.type)).toEqual([
      "image",
    ]);
    expect(diagnosticSlides[1]?.blocks.map((block) => block.type)).toEqual([
      "image",
      "timeline",
    ]);
  });

  it("moves the RPM overlay into the main mechanical narrative", () => {
    const rendered = expandDeck(validateDeck(deck));
    const spectrumIndex = rendered.findIndex(
      (slide) => slide.id === "spectral-evidence",
    );
    const rpmIndex = rendered.findIndex(
      (slide) => slide.id === "spectral-evidence-rpm",
    );
    const appendixIndex = rendered.findIndex(
      (slide) => slide.id === "appendix-divider",
    );

    expect(rpmIndex).toBe(spectrumIndex + 1);
    expect(rpmIndex).toBeLessThan(appendixIndex);
    expect(
      rendered.filter((slide) => slide.id === "spectral-evidence-rpm"),
    ).toHaveLength(1);
  });

  it("removes the duplicated rolling-shutter appendix slide", () => {
    const rendered = expandDeck(validateDeck(deck));

    expect(
      rendered.some((slide) => slide.sourceSlideId === "rolling-shutter-jello"),
    ).toBe(false);
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
    const firstItems =
      rendered[0].blocks[0]?.type === "bullets"
        ? rendered[0].blocks[0].items
        : [];
    const secondItems =
      rendered[1].blocks[0]?.type === "bullets"
        ? rendered[1].blocks[0].items
        : [];

    expect(firstItems.map((item) => item.id)).toEqual(["a"]);
    expect(secondItems.map((item) => item.id)).toEqual(["a", "b"]);
  });
});
