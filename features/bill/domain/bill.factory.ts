import type { Bill } from "./bill.schema";

/** Creates a collision-resistant identifier for persisted bill entities. */
export const createId = () => crypto.randomUUID();

/** Creates a fresh bill with the product's default title, tip, and empty data. */
export function createBill(): Bill {
  return {
    id: createId(),
    version: 2,
    title: "New bill",
    people: [],
    items: [],
    taxCents: 0,
    tipPercent: 20,
    adjustments: [],
    updatedAt: new Date().toISOString(),
  };
}
