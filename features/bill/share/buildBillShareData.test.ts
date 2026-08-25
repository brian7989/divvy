import { describe, expect, it } from "vitest";
import type { Bill } from "../domain/bill.schema";
import { buildBillShareData } from "./buildBillShareData";

const bill: Bill = {
  id: "bill",
  version: 2,
  title: "Weekend",
  updatedAt: "2026-01-01T00:00:00.000Z",
  people: [
    { id: "a", name: "A", color: "red" },
    { id: "b", name: "B", color: "blue" },
    { id: "c", name: "C", color: "green" },
  ],
  items: [
    {
      id: "shared",
      name: "Pizza",
      unitPriceCents: 1000,
      discountCents: 0,
      quantity: 1,
      ownerIds: ["a", "b", "c"],
    },
  ],
  taxCents: 83,
  tipPercent: 20,
  adjustments: [
    { id: "fee", label: "Fee", amountCents: 18, kind: "fee" },
    { id: "discount", label: "Discount", amountCents: 1, kind: "discount" },
  ],
};

describe("buildBillShareData", () => {
  it("itemizes every share and reconciles to each person total", () => {
    const share = buildBillShareData(bill);
    share.people.forEach((person) => {
      const itemizedTotal = [...person.items, ...person.extras].reduce(
        (sum, line) => sum + line.amountCents,
        0,
      );
      expect(itemizedTotal).toBe(person.totalCents);
      expect(person.items[0].label).toBe("Pizza · 1/3 share");
    });
    expect(share.people.reduce((sum, person) => sum + person.totalCents, 0)).toBe(
      share.totalCents,
    );
  });
});
