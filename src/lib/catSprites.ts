// src/lib/catSprites.ts
// Cute front-facing orange-tabby pixel cat. 24x24 grid.
// Each frame: array of 24 strings, each exactly 24 chars. One char = one pixel.
// Palette keys: "." transparent, K outline/eyes, O orange, D dark stripe,
// W white, P pink (inner ear / nose / tongue).

export const PALETTE: Record<string, string> = {
  K: "#241a12", // outline / eyes
  O: "#ef9d43", // orange body
  D: "#c06a1d", // dark-orange stripe
  W: "#f7f1e6", // white chest / muzzle / paws / tail tip
  P: "#f3a9bb", // pink inner ear / nose / tongue
};

export const SPRITE_W = 24;
export const SPRITE_H = 24;

// --- SIT (cute front-facing hero pose) ---
export const SIT: string[] = [
  "........K......K........",
  ".......KKK....KKK.......",
  "......KPPK....KPPK......",
  ".....KOOOOOOOOOOOOK.....",
  "....KOOOOOOOOOOOOOOK....",
  "....KOOODOODDOODOOOK....",
  "....KOOKKKOOOOKKKOOK....",
  "....KOOKWKOOOOKWKOOK....",
  "....KOOOOOOPPOOOOOOK....",
  "....KOOOOWWKKWWOOOOK....",
  "....KOOOWWWWWWWWOOOK....",
  "...KOOOWWWWWWWWWWOOOK...",
  "...KOOOWWWWWWWWWWOOOK...",
  "...KOOOOWWWWWWWWOOOOK...",
  "...KOOOOWWWWWWWWOOOOKKWK",
  "...KODOOWWWWWWWWOODOKKOK",
  "...KOOOOOWWWWWWOOOOOKKOK",
  "...KOOOOOOOWWOOOOOOOKKDK",
  "...KOOOWWWOOOOWWWOOOK...",
  "...KOOWWWWOOOOWWWWOOK...",
  "...KOWKWWOOOOOOWWKWOK...",
  "...KKWWWKKKKKKKKWWWKK...",
  "....KKKK........KKKK....",
  "........................",
];

// --- SIT_BLINK (eyes closed: gentle ^ ^ lines) ---
export const SIT_BLINK: string[] = [
  "........K......K........",
  ".......KKK....KKK.......",
  "......KPPK....KPPK......",
  ".....KOOOOOOOOOOOOK.....",
  "....KOOOOOOOOOOOOOOK....",
  "....KOOODOODDOODOOOK....",
  "....KOOOOOOOOOOOOOOK....",
  "....KOOKKKOOOOKKKOOK....",
  "....KOOOOOOPPOOOOOOK....",
  "....KOOOOWWKKWWOOOOK....",
  "....KOOOWWWWWWWWOOOK....",
  "...KOOOWWWWWWWWWWOOOK...",
  "...KOOOWWWWWWWWWWOOOK...",
  "...KOOOOWWWWWWWWOOOOK...",
  "...KOOOOWWWWWWWWOOOOKKWK",
  "...KODOOWWWWWWWWOODOKKOK",
  "...KOOOOOWWWWWWOOOOOKKOK",
  "...KOOOOOOOWWOOOOOOOKKDK",
  "...KOOOWWWOOOOWWWOOOK...",
  "...KOOWWWWOOOOWWWWOOK...",
  "...KOWKWWOOOOOOWWKWOK...",
  "...KKWWWKKKKKKKKWWWKK...",
  "....KKKK........KKKK....",
  "........................",
];

// --- GROOM2 (eyes closed + tiny pink tongue at muzzle) ---
export const GROOM2: string[] = [
  "........K......K........",
  ".......KKK....KKK.......",
  "......KPPK....KPPK......",
  ".....KOOOOOOOOOOOOK.....",
  "....KOOOOOOOOOOOOOOK....",
  "....KOOODOODDOODOOOK....",
  "....KOOOOOOOOOOOOOOK....",
  "....KOOKKKOOOOKKKOOK....",
  "....KOOOOOOPPOOOOOOK....",
  "....KOOOOWWKKWWOOOOK....",
  "....KOOOWWWPPWWWOOOK....",
  "...KOOOWWWWWWWWWWOOOK...",
  "...KOOOWWWWWWWWWWOOOK...",
  "...KOOOOWWWWWWWWOOOOK...",
  "...KOOOOWWWWWWWWOOOOKKWK",
  "...KODOOWWWWWWWWOODOKKOK",
  "...KOOOOOWWWWWWOOOOOKKOK",
  "...KOOOOOOOWWOOOOOOOKKDK",
  "...KOOOWWWOOOOWWWOOOK...",
  "...KOOWWWWOOOOWWWWOOK...",
  "...KOWKWWOOOOOOWWKWOK...",
  "...KKWWWKKKKKKKKWWWKK...",
  "....KKKK........KKKK....",
  "........................",
];

// --- SLEEP (curled loaf, eyes closed, ear nubs) ---
export const SLEEP: string[] = [
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  ".......KK......KK.......",
  ".....KKKKKKKKKKKKKK.....",
  "....KOOOOOOOOOOOOOOK....",
  "...KOOOOOOOOOOOOOOOOK...",
  "...KOODOOOOOOOODDOOOK...",
  "..KOOKKOOOPPOOOKKOOOK...",
  "..KOOOOOOOOOOOOOOOOOK...",
  "..KOOWWWWWWWWWWWWWWOK...",
  "...KOWWWWWWWWWWWWWWK....",
  "....KOOWWWWWWWWWWOOK....",
  ".....KKKKKKKKKKKKKK.....",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
];

// Frame groups keyed by behavior state.
export const FRAMES = {
  sit: [SIT],
  idle: [SIT],
  walk: [SIT, SIT], // hop conveyed by vertical bob in component
  sleep: [SLEEP],
  groom: [SIT_BLINK, GROOM2],
  stretch: [SIT],
  chase: [SIT],
  happy: [SIT],
  love: [SIT],
} as const;

export type CatState = keyof typeof FRAMES;
