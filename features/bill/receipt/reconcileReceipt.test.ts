import { describe, expect, it } from "vitest";
import { reconcileReceipt } from "./reconcileReceipt";
import type { ParsedReceipt } from "./receipt.schema";

const receipt: ParsedReceipt = {
  merchantName: "Corner Market",
  currency: "USD",
  items: [
    {
      name: "Soda",
      quantity: 2,
      unitPriceCents: 250,
      lineTotalCents: 500,
    },
  ],
  subtotalCents: 500,
  taxCents: 40,
  tipCents: null,
  adjustments: [],
  totalCents: 540,
};

describe("reconcileReceipt", () => {
  it("accepts a receipt whose amounts reconcile", () => {
    expect(reconcileReceipt(receipt)).toEqual([]);
  });

  it("flags conflicting item and total amounts", () => {
    expect(
      reconcileReceipt({
        ...receipt,
        items: [{ ...receipt.items[0], lineTotalCents: 700 }],
      }),
    ).toEqual([
      "Check Soda's quantity and price.",
      "Item prices do not match the receipt subtotal.",
    ]);
  });
});
