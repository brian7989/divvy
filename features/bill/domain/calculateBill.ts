import type { Bill, Person } from "./bill.schema";
import {
  allocateBillItems,
  getResponsibilityWeights,
  type BillItemAllocations,
} from "./allocateBillItems";
import { allocateCents, type Cents } from "./money";

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

function calculateTipCents(subtotalCents: number, tipPercent: number): number {
  return Math.round((subtotalCents * tipPercent) / 100);
}

function calculateRequestedAdjustments(bill: Bill): number {
  return bill.adjustments.reduce(
    (sum, adjustment) =>
      sum +
      (adjustment.kind === "fee"
        ? adjustment.amountCents
        : -adjustment.amountCents),
    0,
  );
}

/** Prevents bill-level discounts from creating a negative amount due. */
function calculateEffectiveAdjustments(
  bill: Bill,
  subtotalCents: number,
  tipCents: number,
): number {
  const minimumAdjustment = -(subtotalCents + bill.taxCents + tipCents);
  return Math.max(calculateRequestedAdjustments(bill), minimumAdjustment);
}

/** Uses payable item cents for discounts so no person can fall below zero. */
function getExtraWeights(
  itemAllocations: BillItemAllocations,
  extrasCents: number,
): Map<string, number> {
  return extrasCents < 0
    ? itemAllocations.itemShares
    : getResponsibilityWeights(itemAllocations);
}

function buildBaseShares(
  bill: Bill,
  itemAllocations: BillItemAllocations,
  extrasCents: number,
): PersonShare[] {
  const weights = getExtraWeights(itemAllocations, extrasCents);
  const extras = allocateCents(
    extrasCents,
    bill.people.map(({ id }) => weights.get(id) ?? 0),
  );

  return bill.people.map((person, index) => {
    const itemsCents = itemAllocations.itemShares.get(person.id) ?? 0;
    const personExtrasCents = extras[index];
    return {
      person,
      itemsCents,
      extrasCents: personExtrasCents,
      totalCents: itemsCents + personExtrasCents,
    };
  });
}

function getActiveWeights(weights: Map<string, number>): number[] {
  return [...weights.values()].filter((weight) => weight > 0);
}

function hasEqualResponsibility(activeWeights: number[]): boolean {
  if (activeWeights.length < 2) return false;
  return activeWeights.every(
    (weight) => Math.abs(weight - activeWeights[0]) < 0.000_001,
  );
}

/** Gives equally responsible people the same payable cent amount. */
function equalizeShares(
  shares: PersonShare[],
  responsibilityWeights: Map<string, number>,
  sourceTotalCents: number,
): PersonShare[] {
  const activeWeights = getActiveWeights(responsibilityWeights);
  if (!hasEqualResponsibility(activeWeights)) return shares;

  const equalTotalCents = Math.round(sourceTotalCents / activeWeights.length);
  return shares.map((share) =>
    (responsibilityWeights.get(share.person.id) ?? 0) > 0
      ? {
          ...share,
          extrasCents: equalTotalCents - share.itemsCents,
          totalCents: equalTotalCents,
        }
      : share,
  );
}

function sumPersonTotals(shares: PersonShare[]): number {
  return shares.reduce((sum, share) => sum + share.totalCents, 0);
}

/**
 * Calculates payable shares with balanced item rounding and equal payments for
 * people who have identical responsibility.
 */
export function calculateBill(bill: Bill): BillTotals {
  const itemAllocations = allocateBillItems(bill);
  const tipCents = calculateTipCents(
    itemAllocations.subtotalCents,
    bill.tipPercent,
  );
  const adjustmentsCents = calculateEffectiveAdjustments(
    bill,
    itemAllocations.subtotalCents,
    tipCents,
  );
  const extrasCents = bill.taxCents + adjustmentsCents + tipCents;
  const sourceTotalCents = itemAllocations.subtotalCents + extrasCents;
  const responsibilityWeights = getResponsibilityWeights(itemAllocations);
  const baseShares = buildBaseShares(bill, itemAllocations, extrasCents);
  const shares = equalizeShares(
    baseShares,
    responsibilityWeights,
    sourceTotalCents,
  );
  const totalCents = sumPersonTotals(shares);

  return {
    subtotalCents: itemAllocations.subtotalCents,
    adjustmentsCents,
    tipCents,
    roundingCents: totalCents - sourceTotalCents,
    totalCents,
    unassignedCount: itemAllocations.unassignedCount,
    shares,
  };
}
