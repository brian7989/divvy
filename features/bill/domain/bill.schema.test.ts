import { describe, expect, it } from "vitest";
import { createBill } from "./bill.factory";
import { BillSchema } from "./bill.schema";

describe("BillSchema", () => {
  it("rejects an empty bill title", () => {
    expect(BillSchema.safeParse({ ...createBill(), title: "" }).success).toBe(
      false,
    );
  });

  it("rejects a whitespace-only bill title", () => {
    expect(
      BillSchema.safeParse({ ...createBill(), title: "   " }).success,
    ).toBe(false);
  });
});
