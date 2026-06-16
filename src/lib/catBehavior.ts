// src/lib/catBehavior.ts
import type { CatState } from "./catSprites";

export type Point = { x: number; y: number };
export type Size = { w: number; h: number };

/**
 * Pick a random target anywhere on screen (full viewport) keeping the whole
 * sprite visible with an 8px margin. The cursor is intentionally NOT used —
 * the cat wanders on its own.
 */
export function pickWanderTarget(
  vw: number,
  vh: number,
  size: Size,
  rand: () => number = Math.random
): Point {
  const maxX = Math.max(8, vw - size.w - 8);
  const maxY = Math.max(8, vh - size.h - 8);
  return {
    x: 8 + rand() * (maxX - 8),
    y: 8 + rand() * (maxY - 8),
  };
}

// Weighted dwell behaviors chosen when the cat arrives at a target.
const DWELL_WEIGHTS: ReadonlyArray<
  [Exclude<CatState, "walk" | "happy" | "love">, number]
> = [
  ["sit", 3],
  ["idle", 4],
  ["groom", 3],
  ["stretch", 2],
  ["sleep", 2],
  ["chase", 1],
];

export function pickDwellState(
  rand: () => number = Math.random
): Exclude<CatState, "walk" | "happy" | "love"> {
  const total = DWELL_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [state, w] of DWELL_WEIGHTS) {
    if (r < w) return state;
    r -= w;
  }
  return "sit";
}

/** Randomized dwell duration (ms) per state. */
export function dwellDuration(
  state: CatState,
  rand: () => number = Math.random
): number {
  switch (state) {
    case "sleep":
      return 6000 + rand() * 6000;
    case "groom":
      return 2500 + rand() * 2500;
    case "chase":
      return 1500 + rand() * 1500;
    case "stretch":
      return 1200 + rand() * 800;
    default:
      return 2000 + rand() * 3000; // sit / idle
  }
}

/** Choose which frame index to show for an animated (multi-frame) state. */
export function frameForState(frameCount: number, tick: number): number {
  if (frameCount <= 1) return 0;
  return tick % frameCount;
}
