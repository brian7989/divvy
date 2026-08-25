import type { Adjustment } from "./bill.schema";

/** Replaces empty or punctuation-only adjustment labels with a useful name. */
export function getAdjustmentLabel(
  label: string,
  kind: Adjustment["kind"],
): string {
  return /[\p{L}\p{N}]/u.test(label) ? label.trim() : kind === "fee" ? "Fee" : "Discount";
}
