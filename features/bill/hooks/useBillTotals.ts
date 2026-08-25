import { useMemo } from "react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { calculateBill } from "@/features/bill/domain/calculateBill";

/** Selects the current bill and memoizes its fully reconciled monetary totals. */
export function useBillTotals() {
  const bill = useBillStore((state) => state.bill);
  return useMemo(() => calculateBill(bill), [bill]);
}
