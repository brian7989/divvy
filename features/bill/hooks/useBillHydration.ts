import { useEffect, useSyncExternalStore } from "react";
import { useBillStore } from "@/features/bill/store/bill.store";

/** Subscribes React to both the beginning and completion of store hydration. */
function subscribeToHydration(onStoreChange: () => void) {
  const persistence = useBillStore.persist;
  if (!persistence) return () => undefined;

  const unsubscribeStart = persistence.onHydrate(onStoreChange);
  const unsubscribeFinish = persistence.onFinishHydration(onStoreChange);

  return () => {
    unsubscribeStart();
    unsubscribeFinish();
  };
}

/** Reads hydration state when Zustand persistence is available in the browser. */
function getHydrationSnapshot() {
  return useBillStore.persist?.hasHydrated() ?? false;
}

/**
 * Restores the persisted bill and reports when it is ready.
 * Returns false on the server to keep SSR markup stable.
 */
export function useBillHydration() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    () => false,
  );

  useEffect(() => {
    void useBillStore.persist?.rehydrate();
  }, []);

  return hydrated;
}
