import { describe, expect, it } from "vitest";
import {
  getParsedReceipt,
  NotAReceiptError,
  type ReceiptAnalysis,
} from "./receipt-analysis";

const parsedReceipt = {
  merchantName: "Corner Shop",
  currency: "USD",
  items: [
    {
      name: "Coffee",
      quantity: 1,
      unitPriceCents: 500,
      discountCents: 0,
      lineTotalCents: 500,
    },
  ],
  subtotalCents: 500,
  taxCents: 45,
  tipCents: null,
  adjustments: [],
  totalCents: 545,
} satisfies NonNullable<ReceiptAnalysis["receipt"]>;

describe("getParsedReceipt", () => {
  it("rejects an image that is very unlikely to be a receipt", () => {
    expect(() =>
      getParsedReceipt({ receiptLikelihood: 0.05, receipt: null }),
    ).toThrow(NotAReceiptError);
  });

  it("accepts an extracted receipt", () => {
    expect(
      getParsedReceipt({ receiptLikelihood: 0.99, receipt: parsedReceipt }),
    ).toBe(parsedReceipt);
  });

  it("treats an uncertain image without extracted data as unreadable", () => {
    expect(() =>
      getParsedReceipt({ receiptLikelihood: 0.5, receipt: null }),
    ).toThrow("The receipt could not be read clearly.");
  });
});
