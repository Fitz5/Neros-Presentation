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
    nerosOrange: "#ED5718",
    coral: "#D95F43",
    gold: "#B8872B",
    indigo: "#4357A6",
    green: "#2F855A",
    red: "#B9433A",
  },
  sections: {
    objective: "#0E7C7B",
    baseline: "#4357A6",
    mechanical: "#D95F43",
    filtering: "#B8872B",
    pid: "#2F855A",
    validation: "#6B4C9A",
  },
  ppt: {
    width: 13.333,
    height: 7.5,
  },
  typography: {
    display: 52,
    title: 29,
    large: 22,
    medium: 13,
    support: 10,
    chrome: 11,
  },
} as const;

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger";
export type TextSize = "support" | "medium" | "large";

export function typographyCqw(points: number) {
  return `${points / 9.6}cqw`;
}

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
