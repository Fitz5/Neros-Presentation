import type { Section } from "./schema";
import { theme } from "./theme";

export type ProgressState = "complete" | "active" | "pending";

export function getProgressState(sections: Section[], activeSectionId: string, index: number) {
  const activeIndex = sections.findIndex((section) => section.id === activeSectionId);

  if (index === activeIndex) {
    return "active" as const;
  }

  return index < activeIndex ? ("complete" as const) : ("pending" as const);
}

export function getProgressMarker(index: number, state: ProgressState) {
  return state === "complete" ? "✓" : String(index + 1).padStart(2, "0");
}

export function getProgressColor(state: ProgressState) {
  switch (state) {
    case "complete":
      return theme.colors.green;
    case "active":
      return theme.colors.nerosOrange;
    case "pending":
      return theme.colors.faint;
  }
}
