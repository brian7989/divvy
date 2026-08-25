import { useBillTotals } from "@/features/bill/hooks/useBillTotals";
import { useBillStore } from "@/features/bill/store/bill.store";
import { formatMoney } from "@/features/bill/domain/money";
import { SummaryRow } from "../SummaryRow/SummaryRow";

export function BillBreakdown() {
  const taxCents = useBillStore((state) => state.bill.taxCents);
  const totals = useBillTotals();
  return (
    <>
      <SummaryRow label="Subtotal" value={formatMoney(totals.subtotalCents)} />
      <SummaryRow
        label="Tax & adjustments"
        value={formatMoney(taxCents + totals.adjustmentsCents)}
      />
      <SummaryRow label="Tip · pre-tax" value={formatMoney(totals.tipCents)} />
    </>
  );
}
