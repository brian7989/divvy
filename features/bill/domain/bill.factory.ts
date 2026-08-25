import type { Bill } from "./bill.schema";

export const DEFAULT_BILL_TITLE = "New bill";

/** Creates a collision-resistant identifier for persisted bill entities. */
export const createId = () => crypto.randomUUID();

/** Creates a fresh bill with the product's default title, tip, and empty data. */
export function createBill(): Bill {
  return {
    id: createId(),
    version: 2,
    title: DEFAULT_BILL_TITLE,
    people: [],
    items: [],
    taxCents: 0,
    tipPercent: 20,
    adjustments: [],
    updatedAt: new Date().toISOString(),
  };
}
