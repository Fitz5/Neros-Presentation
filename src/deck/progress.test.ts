import { describe, expect, it } from "vitest";
import { deck } from "./content";
import { getProgressColor, getProgressMarker, getProgressState } from "./progress";
import { validateDeck } from "./schema";
import { theme } from "./theme";

describe("presentation progress", () => {
  it("supports the six-stage technical sequence", () => {
    const sections = validateDeck(deck).sections;

    expect(sections.map((section) => section.shortTitle)).toEqual([
      "Objective",
      "Baseline Failure",
      "Mechanical",
      "Filtering / ESC",
      "PID Tracking",
      "Final Validation",
    ]);
  });

  it("uses the same completed, active, and pending states for every renderer", () => {
    const sections = validateDeck(deck).sections;
    const states = sections.map((_, index) => getProgressState(sections, "filtering", index));

    expect(states).toEqual(["complete", "complete", "complete", "active", "pending", "pending"]);
    expect(states.map((state, index) => getProgressMarker(index, state))).toEqual([
      "✓",
      "✓",
      "✓",
      "04",
      "05",
      "06",
    ]);
    expect(states.map(getProgressColor)).toEqual([
      theme.colors.green,
      theme.colors.green,
      theme.colors.green,
      theme.colors.nerosOrange,
      theme.colors.faint,
      theme.colors.faint,
    ]);
  });
});
