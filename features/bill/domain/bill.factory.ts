import type { Bill } from "./bill.schema";

export const DEFAULT_BILL_TITLE = "New bill";

/** Creates a collision-resistant identifier for persisted bill entities. */
export const createId = () => crypto.randomUUID();

/** Creates a fresh bill with no charges inferred on the user's behalf. */
export function createBill(): Bill {
  return {
    id: createId(),
    version: 2,
    title: DEFAULT_BILL_TITLE,
    people: [],
    items: [],
    taxCents: 0,
    tipPercent: 0,
    adjustments: [],
    updatedAt: new Date().toISOString(),
  };
}
