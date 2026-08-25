import { describe, expect, it } from "vitest";
import { createBill } from "./bill.factory";
import { BillSchema } from "./bill.schema";

describe("BillSchema", () => {
  it("creates bills without assuming a tip", () => {
    expect(createBill().tipPercent).toBe(0);
  });

  it("rejects an empty bill title", () => {
    expect(BillSchema.safeParse({ ...createBill(), title: "" }).success).toBe(
      false,
    );
  });

  it("rejects a whitespace-only bill title", () => {
    expect(
      BillSchema.safeParse({ ...createBill(), title: "   " }).success,
    ).toBe(false);
  });

  it("migrates saved items created before item discounts", () => {
    const result = BillSchema.safeParse({
      ...createBill(),
      items: [
        {
          id: "item",
          name: "Pizza",
          unitPriceCents: 1200,
          quantity: 1,
          ownerIds: [],
        },
      ],
    });
    expect(result.success && result.data.items[0].discountCents).toBe(0);
  });

  it("rejects a discount larger than its item total", () => {
    const result = BillSchema.safeParse({
      ...createBill(),
      items: [
        {
          id: "item",
          name: "Pizza",
          unitPriceCents: 1200,
          discountCents: 1201,
          quantity: 1,
          ownerIds: [],
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});
