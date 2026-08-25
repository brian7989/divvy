import type { Bill, Person } from "./bill.schema";
import { allocateCents, type Cents } from "./money";
import { allocateBillItems } from "./allocateBillItems";

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
  roundingCents: Cents;
  totalCents: Cents;
  unassignedCount: number;
  shares: PersonShare[];
};

/**
 * Balances item rounding, then equalizes people with identical responsibility.
 * A small explicit rounding adjustment may prioritize equal payments.
 */
export function calculateBill(bill: Bill): BillTotals {
  const { exactShares, itemShares, subtotalCents, unassignedCount } =
    allocateBillItems(bill);

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
  const weights = bill.people.map((person) => exactShares.get(person.id) ?? 0);
  const extras = allocateCents(extrasCents, weights);
  let shares = bill.people.map((person, index) => {
    const itemsCents = itemShares.get(person.id) ?? 0;
    return {
      person,
      itemsCents,
      extrasCents: extras[index],
      totalCents: itemsCents + extras[index],
    };
  });
  const sourceTotalCents = subtotalCents + extrasCents;
  const activeExactShares = [...exactShares.values()].filter(
    (share) => share > 0,
  );
  const equallyResponsible = activeExactShares.every(
    (share) => Math.abs(share - activeExactShares[0]) < 0.000_001,
  );

  if (activeExactShares.length > 1 && equallyResponsible) {
    const equalTotalCents = Math.round(
      sourceTotalCents / activeExactShares.length,
    );
    shares = shares.map((share) =>
      (exactShares.get(share.person.id) ?? 0) > 0
        ? {
            ...share,
            extrasCents: equalTotalCents - share.itemsCents,
            totalCents: equalTotalCents,
          }
        : share,
    );
  }

  const collectedTotalCents = shares.reduce(
    (sum, share) => sum + share.totalCents,
    0,
  );

  return {
    subtotalCents,
    adjustmentsCents,
    tipCents,
    roundingCents: collectedTotalCents - sourceTotalCents,
    totalCents: collectedTotalCents,
    unassignedCount,
    shares,
  };
}
