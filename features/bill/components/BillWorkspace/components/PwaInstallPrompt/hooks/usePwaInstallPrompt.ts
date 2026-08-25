import { useEffect, useState } from "react";

const PROMPTED_STORAGE_KEY = "divvy-pwa-install-prompt-v2";

type InstallChoice = { outcome: "accepted" | "dismissed" };

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
};

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

function isAppleMobile(): boolean {
  const appleUserAgent = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const touchEnabledMac =
    /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
  return appleUserAgent || touchEnabledMac;
}

function isMobileDevice(): boolean {
  return (
    isAppleMobile() ||
    /Android/.test(navigator.userAgent) ||
    window.matchMedia("(max-width: 900px) and (pointer: coarse)").matches
  );
}

function isSafari(): boolean {
  const userAgent = navigator.userAgent;
  return /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS/.test(userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as NavigatorWithStandalone).standalone)
  );
}

function hasSeenPrompt(): boolean {
  return localStorage.getItem(PROMPTED_STORAGE_KEY) === "true";
}

function rememberPrompt(): void {
  localStorage.setItem(PROMPTED_STORAGE_KEY, "true");
}

export function usePwaInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<InstallPromptEvent | null>(null);
  const [opened, setOpened] = useState(false);
  const appleMobile =
    typeof navigator === "undefined" ? false : isAppleMobile();
  const appleSafari = appleMobile && isSafari();

  const dismiss = () => {
    rememberPrompt();
    setOpened(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    dismiss();
    setInstallEvent(null);
  };

  useEffect(() => {
    const handleInstallAvailable = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const handleInstalled = () => dismiss();
    window.addEventListener("beforeinstallprompt", handleInstallAvailable);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallAvailable);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!isMobileDevice() || isStandalone() || hasSeenPrompt()) return;
    const timeout = window.setTimeout(() => setOpened(true), 900);
    return () => window.clearTimeout(timeout);
  }, []);

  return {
    appleMobile,
    appleSafari,
    canInstall: Boolean(installEvent),
    dismiss,
    install,
    opened,
  };
}
