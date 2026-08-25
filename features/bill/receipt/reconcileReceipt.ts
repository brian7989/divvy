import type { ParsedReceipt } from "./receipt.schema";

const CENT_TOLERANCE = 2;

/** Returns human-readable warnings when extracted receipt arithmetic conflicts. */
export function reconcileReceipt(receipt: ParsedReceipt): string[] {
  const warnings: string[] = [];

  receipt.items.forEach((item) => {
    const calculated =
      item.unitPriceCents * item.quantity - item.discountCents;
    if (Math.abs(calculated - item.lineTotalCents) > CENT_TOLERANCE)
      warnings.push(`Check ${item.name}'s quantity and price.`);
  });

  const itemTotal = receipt.items.reduce(
    (sum, item) => sum + item.lineTotalCents,
    0,
  );
  if (
    receipt.subtotalCents !== null &&
    Math.abs(itemTotal - receipt.subtotalCents) > CENT_TOLERANCE
  )
    warnings.push("Item prices do not match the receipt subtotal.");

  if (receipt.totalCents !== null && receipt.subtotalCents !== null) {
    const adjustments = receipt.adjustments.reduce(
      (sum, adjustment) =>
        sum +
        (adjustment.kind === "fee"
          ? adjustment.amountCents
          : -adjustment.amountCents),
      0,
    );
    const calculatedTotal =
      receipt.subtotalCents +
      (receipt.taxCents ?? 0) +
      (receipt.tipCents ?? 0) +
      adjustments;
    if (Math.abs(calculatedTotal - receipt.totalCents) > CENT_TOLERANCE)
      warnings.push("The extracted total needs a quick review.");
  }

  return [...new Set(warnings)];
}
