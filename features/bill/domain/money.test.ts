import { describe, expect, it } from "vitest";
import { allocateCents, dollarsToCents } from "./money";

describe("money", () => {
  it("converts display dollars into integer cents", () =>
    expect(dollarsToCents("12.345")).toBe(1235));
  it("preserves the allocated total", () =>
    expect(
      allocateCents(101, [1, 1]).reduce((sum, value) => sum + value, 0),
    ).toBe(101));
  it("handles empty weights", () => expect(allocateCents(100, [])).toEqual([]));
  it("preserves negative totals", () =>
    expect(sum(allocateCents(-101, [1, 2, 3]))).toBe(-101));
  it("does not allocate money without positive weights", () =>
    expect(allocateCents(100, [0, 0])).toEqual([0, 0]));
});

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
