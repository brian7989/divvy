import type { BillItem } from "./bill.schema";

/** Returns a line item's total after its item-specific discount. */
export function getItemTotal(item: BillItem): number {
  return item.unitPriceCents * item.quantity - item.discountCents;
}
