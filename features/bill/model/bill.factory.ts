import type { Bill } from "./bill.schema";

export const PERSON_COLORS = [
  "#ff654b",
  "#8b68e8",
  "#2cae8b",
  "#e3a21a",
  "#3b82d0",
  "#e05d97",
];
export const createId = () => crypto.randomUUID();

export function createBill(): Bill {
  return {
    id: createId(),
    version: 2,
    title: "New bill",
    people: [{ id: createId(), name: "You", color: PERSON_COLORS[0] }],
    items: [],
    taxCents: 0,
    tipPercent: 20,
    adjustments: [],
    updatedAt: new Date().toISOString(),
  };
}
