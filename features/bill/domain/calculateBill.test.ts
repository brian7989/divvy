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
  it("keeps equally responsible people on the same cent amount", () => {
    const totals = calculateBill(bill);
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      433, 433, 433,
    ]);
    expect(totals.totalCents).toBe(1299);
    expect(totals.roundingCents).toBe(-1);
  });
  it("prefers equal payments over assigning an indivisible cent", () => {
    const totals = calculateBill({
      ...bill,
      taxCents: 0,
      tipPercent: 0,
      adjustments: [],
    });
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      333, 333, 333,
    ]);
    expect(totals.roundingCents).toBe(-1);
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

  it("equalizes a seven-way receipt split across several rounded items", () => {
    const people = Array.from({ length: 9 }, (_, index) => ({
      id: String(index),
      name: String(index),
      color: "purple",
    }));
    const ownerIds = people.slice(0, 7).map(({ id }) => id);
    const totals = calculateBill({
      ...bill,
      people,
      items: [340, 300, 469].map((unitPriceCents, index) => ({
        id: String(index),
        name: String(index),
        unitPriceCents,
        discountCents: 0,
        quantity: 1,
        ownerIds,
      })),
      taxCents: 109,
      tipPercent: (219 / 1109) * 100,
      adjustments: [],
    });
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      ...Array(7).fill(205),
      0,
      0,
    ]);
    expect(totals.totalCents).toBe(1435);
    expect(totals.roundingCents).toBe(-2);
  });

  it("still reconciles mixed ownership exactly", () => {
    const totals = calculateBill({
      ...bill,
      taxCents: 0,
      tipPercent: 0,
      adjustments: [],
      items: [
        { ...bill.items[0], ownerIds: ["a", "b"] },
        {
          ...bill.items[0],
          id: "second",
          unitPriceCents: 101,
          ownerIds: ["b", "c"],
        },
      ],
    });
    expect(totals.roundingCents).toBe(0);
    expect(totals.shares.reduce((sum, share) => sum + share.totalCents, 0)).toBe(
      1101,
    );
  });
});
