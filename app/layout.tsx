import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import { AppProviders } from "./providers";

const appFont = Plus_Jakarta_Sans({
  variable: "--font-app-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Divvy — Split the bill, not the vibe",
  description: "A fast, friendly way to split shared expenses fairly.",
  appleWebApp: { capable: true, title: "Divvy", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#754cff" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${appFont.className} ${appFont.variable}`}>
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
