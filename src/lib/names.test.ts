import { describe, it, expect } from "vitest";
import { randomIdentity, identityLabel, ADJECTIVES, ANIMALS } from "./names";

describe("randomIdentity", () => {
  it("returns an adjective and animal from the lists", () => {
    const id = randomIdentity(() => 0);
    expect(ADJECTIVES).toContain(id.adjective);
    expect(ANIMALS).toContain(id.animal);
  });

  it("uses the injected RNG deterministically", () => {
    const id = randomIdentity(() => 0);
    expect(id).toEqual({ adjective: ADJECTIVES[0], animal: ANIMALS[0] });
  });

  it("picks the last entries when RNG returns near 1", () => {
    const id = randomIdentity(() => 0.999999);
    expect(id).toEqual({
      adjective: ADJECTIVES[ADJECTIVES.length - 1],
      animal: ANIMALS[ANIMALS.length - 1],
    });
  });

  it("formats a label as 'adjective animal'", () => {
    expect(identityLabel({ adjective: "keen", animal: "lynx" })).toBe("keen lynx");
  });
});
