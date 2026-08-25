import { useEffect } from "react";
import { billRepository } from "../repositories/bill.repository";
import { useBillStore } from "../model/bill.store";

export function useBillPersistence() {
  const bill = useBillStore((state) => state.bill);
  const hydrated = useBillStore((state) => state.hydrated);
  const hydrate = useBillStore((state) => state.hydrate);

  useEffect(() => {
    billRepository.loadLatest().then((saved) => hydrate(saved ?? bill));
    // Initial hydration must run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(
      () => void billRepository.save(bill),
      250,
    );
    return () => window.clearTimeout(timeout);
  }, [bill, hydrated]);

  return hydrated;
}
