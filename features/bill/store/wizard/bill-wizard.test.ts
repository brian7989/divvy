import { describe, expect, it } from "vitest";
import { canContinueFromPeople, getAdjacentStep } from "./bill-wizard";

describe("canContinueFromPeople", () => {
  it("requires a title and at least two people", () => {
    expect(canContinueFromPeople(0, "Trip")).toBe(false);
    expect(canContinueFromPeople(1, "Trip")).toBe(false);
    expect(canContinueFromPeople(2, "   ")).toBe(false);
    expect(canContinueFromPeople(2, "Trip")).toBe(true);
  });
});

describe("getAdjacentStep", () => {
  it("moves forward and backward", () => {
    expect(getAdjacentStep("entry", 1)).toBe("assign");
    expect(getAdjacentStep("assign", -1)).toBe("entry");
  });

  it("stays within the wizard boundaries", () => {
    expect(getAdjacentStep("people", -1)).toBe("people");
    expect(getAdjacentStep("review", 1)).toBe("review");
  });
});
