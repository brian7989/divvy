import { useEffect } from "react";

/** Registers the service worker once in browsers that support offline apps. */
export function usePwa() {
  useEffect(() => {
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
}
