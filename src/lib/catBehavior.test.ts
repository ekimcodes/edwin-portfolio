// src/lib/catBehavior.test.ts
import { describe, it, expect } from "vitest";
import {
  pickWanderTarget,
  pickDwellState,
  dwellDuration,
  frameForState,
} from "./catBehavior";

const size = { w: 80, h: 80 };

describe("pickWanderTarget", () => {
  it("stays within viewport minus margin", () => {
    const p = pickWanderTarget(1000, 800, size, () => 0.5);
    expect(p.x).toBeGreaterThanOrEqual(8);
    expect(p.y).toBeGreaterThanOrEqual(8);
    expect(p.x).toBeLessThanOrEqual(1000 - size.w - 8);
    expect(p.y).toBeLessThanOrEqual(800 - size.h - 8);
  });
  it("rand=0 gives the min corner", () => {
    const p = pickWanderTarget(1000, 800, size, () => 0);
    expect(p).toEqual({ x: 8, y: 8 });
  });
});

describe("pickDwellState", () => {
  it("rand=0 returns the first weighted state (sit)", () => {
    expect(pickDwellState(() => 0)).toBe("sit");
  });
  it("never returns walk/happy/love", () => {
    for (let i = 0; i < 50; i++) {
      const s = pickDwellState(() => i / 50);
      expect(["walk", "happy", "love"]).not.toContain(s);
    }
  });
});

describe("dwellDuration", () => {
  it("sleep dwells longest at rand=0", () => {
    expect(dwellDuration("sleep", () => 0)).toBeGreaterThanOrEqual(6000);
  });
  it("sit/idle uses the default range", () => {
    expect(dwellDuration("sit", () => 0)).toBe(2000);
  });
});

describe("frameForState", () => {
  it("cycles through frames by tick", () => {
    expect(frameForState(2, 0)).toBe(0);
    expect(frameForState(2, 1)).toBe(1);
    expect(frameForState(2, 2)).toBe(0);
  });
  it("returns 0 for single-frame states", () => {
    expect(frameForState(1, 7)).toBe(0);
  });
});
