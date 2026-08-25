import { describe, expect, it } from "vitest";
import { getPersonColor } from "./person-colors";

describe("getPersonColor", () => {
  it("returns colors in palette order", () => {
    expect(getPersonColor(0)).toBe("#754cff");
    expect(getPersonColor(1)).toBe("#ed5db5");
  });

  it("wraps after the final palette color", () => {
    expect(getPersonColor(6)).toBe(getPersonColor(0));
  });
});
