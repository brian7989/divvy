export type Cents = number;

/** Converts a dollar input into rounded integer cents; invalid input becomes 0. */
export function dollarsToCents(value: number | string): Cents {
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
}

/** Converts integer cents to a dollar value suitable for display controls. */
export function centsToDollars(cents: Cents): number {
  return cents / 100;
}

/** Formats cents as US dollars using the browser's locale-aware formatter. */
export function formatMoney(cents: Cents): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(centsToDollars(cents));
}

/**
 * Splits cents proportionally, assigning remainders deterministically.
 * Returned portions always add up exactly to `total`.
 */
export function allocateCents(total: Cents, weights: number[]): Cents[] {
  if (!weights.length) return [];
  const weightTotal = weights.reduce(
    (sum, weight) => sum + Math.max(0, weight),
    0,
  );
  if (!weightTotal) return weights.map(() => 0);

  const exact = weights.map(
    (weight) => (total * Math.max(0, weight)) / weightTotal,
  );
  const allocated = exact.map(Math.floor);
  const remainder = total - allocated.reduce((sum, value) => sum + value, 0);
  const priority = exact
    .map((value, index) => ({ index, fraction: value - allocated[index] }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  for (let index = 0; index < remainder; index += 1)
    allocated[priority[index].index] += 1;
  return allocated;
}
