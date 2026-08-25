import { describe, expect, it } from "vitest";
import { getPersonEmoji } from "./person-emojis";

describe("getPersonEmoji", () => {
  it("returns the same character for the same person", () => {
    expect(getPersonEmoji("alex")).toBe(getPersonEmoji("alex"));
  });

  it("returns an emoji for any identifier", () => {
    expect(getPersonEmoji("person-123")).toMatch(/\p{Emoji}/u);
  });
});
