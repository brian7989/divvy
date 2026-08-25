import type { Bill } from "./bill.schema";
import { getItemTotal } from "./getItemTotal";

export type ItemAllocation = {
  itemId: string;
  portions: Map<string, number>;
};

export type BillItemAllocations = {
  allocations: ItemAllocation[];
  exactShares: Map<string, number>;
  itemShares: Map<string, number>;
  participationCounts: Map<string, number>;
  subtotalCents: number;
  unassignedCount: number;
};

/** Uses monetary responsibility, falling back to participation for zero items. */
export function getResponsibilityWeights(
  allocations: BillItemAllocations,
): Map<string, number> {
  const exactWeightTotal = [...allocations.exactShares.values()].reduce(
    (sum, share) => sum + share,
    0,
  );
  return exactWeightTotal
    ? allocations.exactShares
    : allocations.participationCounts;
}

function getNextRemainderOwner(
  ownerIds: string[],
  exactShares: Map<string, number>,
  itemShares: Map<string, number>,
): string {
  return ownerIds.reduce((bestId, personId) => {
    const deficit =
      (exactShares.get(personId) ?? 0) - (itemShares.get(personId) ?? 0);
    const bestDeficit =
      (exactShares.get(bestId) ?? 0) - (itemShares.get(bestId) ?? 0);
    return deficit > bestDeficit ? personId : bestId;
  });
}

/** Allocates item cents while balancing cumulative rounding among owners. */
export function allocateBillItems(bill: Bill): BillItemAllocations {
  const exactShares = new Map(bill.people.map(({ id }) => [id, 0]));
  const itemShares = new Map(bill.people.map(({ id }) => [id, 0]));
  const participationCounts = new Map(bill.people.map(({ id }) => [id, 0]));
  const allocations: ItemAllocation[] = [];
  let subtotalCents = 0;
  let unassignedCount = 0;

  bill.items.forEach((item) => {
    const total = getItemTotal(item);
    subtotalCents += total;
    const ownerIds = bill.people
      .filter(({ id }) => item.ownerIds.includes(id))
      .map(({ id }) => id);
    const portions = new Map<string, number>();

    if (!ownerIds.length) {
      unassignedCount += 1;
      allocations.push({ itemId: item.id, portions });
      return;
    }

    const exactPortion = total / ownerIds.length;
    const basePortion = Math.floor(exactPortion);
    ownerIds.forEach((personId) => {
      participationCounts.set(
        personId,
        (participationCounts.get(personId) ?? 0) + 1,
      );
      exactShares.set(
        personId,
        (exactShares.get(personId) ?? 0) + exactPortion,
      );
      itemShares.set(
        personId,
        (itemShares.get(personId) ?? 0) + basePortion,
      );
      portions.set(personId, basePortion);
    });

    const remainder = total - basePortion * ownerIds.length;
    for (let cent = 0; cent < remainder; cent += 1) {
      const personId = getNextRemainderOwner(
        ownerIds,
        exactShares,
        itemShares,
      );
      itemShares.set(personId, (itemShares.get(personId) ?? 0) + 1);
      portions.set(personId, (portions.get(personId) ?? 0) + 1);
    }
    allocations.push({ itemId: item.id, portions });
  });

  return {
    allocations,
    exactShares,
    itemShares,
    participationCounts,
    subtotalCents,
    unassignedCount,
  };
}
