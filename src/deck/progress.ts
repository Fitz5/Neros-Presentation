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

export function getSectionColor(sectionId: string) {
  switch (sectionId) {
    case "objective":
      return theme.sections.objective;
    case "baseline":
      return theme.sections.baseline;
    case "mechanical":
      return theme.sections.mechanical;
    case "filtering":
      return theme.sections.filtering;
    case "pid":
      return theme.sections.pid;
    case "validation":
      return theme.sections.validation;
    default:
      return theme.colors.accent;
  }
}
