import { createTheme } from "@mantine/core";

/** Shared Mantine design tokens for Divvy's color, radius, and typography. */
export const theme = createTheme({
  primaryColor: "party",
  colors: {
    party: [
      "#f2efff",
      "#e5deff",
      "#c9baff",
      "#aa91ff",
      "#8d68ff",
      "#754cff",
      "#6438f5",
      "#542bda",
      "#4624b5",
      "#3b218f",
    ],
  },
  defaultRadius: "md",
  fontFamily: "var(--font-app-sans), system-ui, sans-serif",
  headings: {
    fontFamily: "var(--font-app-sans), system-ui, sans-serif",
  },
});
