// src/lib/catSprites.test.ts
import { describe, it, expect } from "vitest";
import { FRAMES, PALETTE, SPRITE_W, SPRITE_H } from "./catSprites";

const VALID = new Set([".", ...Object.keys(PALETTE)]);

describe("cat sprites", () => {
  const allFrames = Object.values(FRAMES).flat();

  it("every frame has SPRITE_H rows", () => {
    for (const f of allFrames) expect(f.length).toBe(SPRITE_H);
  });

  it("every row is exactly SPRITE_W chars", () => {
    for (const f of allFrames)
      for (const row of f) expect(row.length).toBe(SPRITE_W);
  });

  it("every pixel is a known palette key or transparent", () => {
    for (const f of allFrames)
      for (const row of f)
        for (const ch of row) expect(VALID.has(ch)).toBe(true);
  });
});
