"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { ReactNode } from "react";
import { theme } from "./theme/theme";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <ModalsProvider modalProps={{ centered: true }}>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
