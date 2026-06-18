export const theme = {
  fonts: {
    sans: "Aptos, Segoe UI, Inter, Arial, sans-serif",
    mono: "Cascadia Code, Consolas, monospace",
  },
  colors: {
    paper: "#F8F6F0",
    surface: "#FFFFFF",
    ink: "#1D2528",
    muted: "#5F6F73",
    faint: "#DCE3DE",
    accent: "#0E7C7B",
    coral: "#D95F43",
    gold: "#B8872B",
    indigo: "#4357A6",
    green: "#2F855A",
    red: "#B9433A",
  },
  sections: {
    context: "#0E7C7B",
    architecture: "#4357A6",
    deepDive: "#D95F43",
    execution: "#2F855A",
    discussion: "#B8872B",
  },
  ppt: {
    width: 13.333,
    height: 7.5,
  },
} as const;

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

export function toneColor(tone: Tone = "neutral") {
  switch (tone) {
    case "accent":
      return theme.colors.accent;
    case "success":
      return theme.colors.green;
    case "warning":
      return theme.colors.gold;
    case "danger":
      return theme.colors.red;
    case "neutral":
    default:
      return theme.colors.indigo;
  }
}
