import { describe, expect, it } from "vitest";
import type { Bill } from "./bill.schema";
import { calculateBill } from "./calculateBill";

const bill: Bill = {
  id: "bill",
  version: 2,
  title: "Test",
  updatedAt: "2026-01-01T00:00:00.000Z",
  people: [
    { id: "a", name: "A", color: "red" },
    { id: "b", name: "B", color: "blue" },
    { id: "c", name: "C", color: "green" },
  ],
  items: [
    {
      id: "item",
      name: "Shared",
      unitPriceCents: 1000,
      discountCents: 0,
      quantity: 1,
      ownerIds: ["a", "b", "c"],
    },
  ],
  taxCents: 83,
  tipPercent: 20,
  adjustments: [{ id: "fee", label: "Fee", amountCents: 17, kind: "fee" }],
};

describe("calculateBill", () => {
  it("reconciles person totals to the bill total exactly", () => {
    const totals = calculateBill(bill);
    expect(
      totals.shares.reduce((sum, share) => sum + share.totalCents, 0),
    ).toBe(totals.totalCents);
    expect(totals.totalCents).toBe(1300);
  });
  it("distributes indivisible cents deterministically", () => {
    const totals = calculateBill({
      ...bill,
      taxCents: 0,
      tipPercent: 0,
      adjustments: [],
    });
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      334, 333, 333,
    ]);
  });
  it("reports unassigned items", () => {
    const totals = calculateBill({
      ...bill,
      items: [{ ...bill.items[0], ownerIds: [] }],
    });
    expect(totals.unassignedCount).toBe(1);
    expect(totals.shares.every(({ totalCents }) => totalCents === 0)).toBe(
      true,
    );
  });
  it("applies an item discount before splitting its owners", () => {
    const totals = calculateBill({
      ...bill,
      taxCents: 0,
      tipPercent: 0,
      adjustments: [],
      items: [{ ...bill.items[0], discountCents: 100 }],
    });
    expect(totals.subtotalCents).toBe(900);
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      300, 300, 300,
    ]);
  });
});
