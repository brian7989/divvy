import type { Bill, Person } from "./bill.schema";
import { allocateCents, type Cents } from "./money";
import { getItemTotal } from "./getItemTotal";

export type PersonShare = {
  person: Person;
  itemsCents: Cents;
  extrasCents: Cents;
  totalCents: Cents;
};
export type BillTotals = {
  subtotalCents: Cents;
  adjustmentsCents: Cents;
  tipCents: Cents;
  totalCents: Cents;
  unassignedCount: number;
  shares: PersonShare[];
};

/**
 * Splits items equally among owners, then allocates extras proportionally.
 * Integer-cent math ensures every share reconciles to the bill total.
 */
export function calculateBill(bill: Bill): BillTotals {
  const itemShares = new Map(bill.people.map((person) => [person.id, 0]));
  let subtotalCents = 0;
  let unassignedCount = 0;

  for (const item of bill.items) {
    const total = getItemTotal(item);
    subtotalCents += total;
    const owners = bill.people.filter((person) =>
      item.ownerIds.includes(person.id),
    );
    if (!owners.length) {
      unassignedCount += 1;
      continue;
    }
    const portions = allocateCents(
      total,
      owners.map(() => 1),
    );
    owners.forEach((owner, index) =>
      itemShares.set(
        owner.id,
        (itemShares.get(owner.id) ?? 0) + portions[index],
      ),
    );
  }

  const adjustmentsCents = bill.adjustments.reduce(
    (sum, adjustment) =>
      sum +
      (adjustment.kind === "fee"
        ? adjustment.amountCents
        : -adjustment.amountCents),
    0,
  );
  const tipCents = Math.round((subtotalCents * bill.tipPercent) / 100);
  const extrasCents = bill.taxCents + adjustmentsCents + tipCents;
  const weights = bill.people.map((person) => itemShares.get(person.id) ?? 0);
  const extras = allocateCents(extrasCents, weights);
  const shares = bill.people.map((person, index) => {
    const itemsCents = itemShares.get(person.id) ?? 0;
    return {
      person,
      itemsCents,
      extrasCents: extras[index],
      totalCents: itemsCents + extras[index],
    };
  });

  return {
    subtotalCents,
    adjustmentsCents,
    tipCents,
    totalCents: subtotalCents + extrasCents,
    unassignedCount,
    shares,
  };
}
