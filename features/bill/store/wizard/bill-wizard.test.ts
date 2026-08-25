import { describe, expect, it } from "vitest";
import { getAdjacentStep } from "./bill-wizard";

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
