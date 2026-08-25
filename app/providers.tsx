"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { ReactNode } from "react";

const theme = createTheme({
  primaryColor: "coral",
  colors: {
    coral: [
      "#fff3f0",
      "#ffe2dc",
      "#ffc2b6",
      "#ff9d8b",
      "#ff7962",
      "#ff654b",
      "#f24f34",
      "#cb3d27",
      "#a83221",
      "#8b2e22",
    ],
  },
  defaultRadius: "md",
  fontFamily: "var(--font-geist-sans), sans-serif",
  headings: { fontFamily: "var(--font-geist-sans), sans-serif" },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
