// src/lib/catSprites.ts
// Orange-tabby pixel cat. 16x16 grid, drawn facing RIGHT.
// Each frame: array of 16 strings, each exactly 16 chars. One char = one pixel.
// Palette keys: "." transparent, K outline, O orange, D dark-orange stripe,
// W white, P pink, G green eye.

export const PALETTE: Record<string, string> = {
  K: "#3a2a1a", // outline / dark
  O: "#e8943a", // orange body
  D: "#bd6a1e", // dark-orange stripe
  W: "#f5efe2", // white belly / paws / muzzle
  P: "#e58aa0", // pink nose / inner ear
  G: "#5b8c3a", // eye (open, green)
};

export const SPRITE_W = 16;
export const SPRITE_H = 16;

// --- SIT (upright, facing right; two ears, two eyes, tail curled left) ---
export const SIT: string[] = [
  "................",
  ".......KK...KK..",
  ".......KPK.KPK..",
  "......KKOOOOOKK.",
  "......KOGOOGOOK.",
  "......KOOOPOOK..",
  "...K..KOOOOOOK..",
  "..KKKKKOOOOOK...",
  ".KOOOOOOODOOK...",
  ".KOOOODOOOOOK...",
  ".KOOOOOOOOOOK...",
  ".KWOOOOOOOWWK...",
  ".KWKWKWKWKWK....",
  "..K..K..K..K....",
  "................",
  "................",
];

// --- WALK frame 1 (horizontal body, legs gathered) ---
export const WALK1: string[] = [
  "................",
  "............KK..",
  "...K.......KPPK.",
  "..KK......KOOOOK",
  ".KKKKKKKKKKOGOK.",
  ".KOOOOOOOOOOOOPK",
  ".KOODOOODOOOOOK.",
  ".KOOOOOOOOOOOOK.",
  ".KKOKKOKKOKKOK..",
  "..K.KK.KK.KK....",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
];

// --- WALK frame 2 (legs extended) ---
export const WALK2: string[] = [
  "................",
  "............KK..",
  "...K.......KPPK.",
  "..KK......KOOOOK",
  ".KKKKKKKKKKOGOK.",
  ".KOOOOOOOOOOOOPK",
  ".KOODOOODOOOOOK.",
  ".KOOOOOOOOOOOOK.",
  ".KOKKOKKOKKOKK..",
  ".K.KK.KK.KK.K...",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
];

// --- SLEEP (curled loaf, eyes closed) ---
export const SLEEP: string[] = [
  "................",
  "................",
  "................",
  "................",
  ".....KKKKKK.....",
  "...KKOOOOOOKK...",
  "..KOOOOOOOOOOK..",
  ".KOOKKOOOOKKOOK.",
  ".KOOOOOODOOOOOK.",
  ".KOODOOOOOOOOOK.",
  ".KOOOOOOOOOOOOK.",
  "..KWWOOOOOOWWK..",
  "...KKWWWWWWKK...",
  ".....KKKKKK.....",
  "................",
  "................",
];

// --- GROOM 1 (sitting, head dipped, licking) ---
export const GROOM1: string[] = [
  "................",
  ".......KK...KK..",
  ".......KPK.KPK..",
  "......KKOOOOOKK.",
  "......KOOOOOOOK.",
  ".....KOOOOOOK...",
  "...K.KOOOOOK....",
  "..KKKKOOOOOK....",
  ".KOOOOOOODOOK...",
  ".KOOOODOOOOOK...",
  ".KOOOOOOOOOOK...",
  ".KWOOOOOOOWWK...",
  ".KWKWKWKWKWK....",
  "..K..K..K..K....",
  "................",
  "................",
];

// --- GROOM 2 (tongue out) ---
export const GROOM2: string[] = [
  "................",
  ".......KK...KK..",
  ".......KPK.KPK..",
  "......KKOOOOOKK.",
  "......KOOOOOOOK.",
  ".....KOOOOOOK...",
  "...K.KOOOOOKP...",
  "..KKKKOOOOOK....",
  ".KOOOOOOODOOK...",
  ".KOOOODOOOOOK...",
  ".KOOOOOOOOOOK...",
  ".KWOOOOOOOWWK...",
  ".KWKWKWKWKWK....",
  "..K..K..K..K....",
  "................",
  "................",
];

// --- STRETCH (front legs forward, back arched, head far right) ---
export const STRETCH: string[] = [
  "................",
  "..............KK",
  ".............KPK",
  "...........KOOOK",
  "..........KOGOOK",
  "K.........KOOPOK",
  "KK.......KKOOOOK",
  ".KKKKKKKKKOOOOK.",
  "..KOODOOOOODOOK.",
  "...KOOOOOOOOOOK.",
  "...KWOOOOOOOOOK.",
  ".KKKWOOWOOWOWK..",
  ".KWWK...........",
  "................",
  "................",
  "................",
];

// --- CHASE (tail-chase, compact circular pose) ---
export const CHASE: string[] = [
  "................",
  "......KKKK......",
  ".....KOOOOK.....",
  "....KOGOOGOK....",
  "....KOOPOOOK....",
  "...KKOOOOOOKK...",
  "..KOOOOOOOOOOK..",
  "..KOODOOOODOOK..",
  "..KOOOOOOOOOOK..",
  "..KKOOOOOOOOKK..",
  "...KOOOOOOOOK...",
  "....KWWKKWWK....",
  ".....KK..KK.....",
  "................",
  "................",
  "................",
];

// Frame groups keyed by behavior state.
export const FRAMES = {
  sit: [SIT],
  idle: [SIT], // blink handled by renderer overlay
  walk: [WALK1, WALK2],
  sleep: [SLEEP],
  groom: [GROOM1, GROOM2],
  stretch: [STRETCH],
  chase: [CHASE],
  happy: [SIT], // reaction; bubble conveys mood
  love: [SIT],
} as const;

export type CatState = keyof typeof FRAMES;

// Eye pixels (row,col) to blank out for a blink (turn G -> K). Matches SIT.
export const EYE_PIXELS: ReadonlyArray<[number, number]> = [
  [4, 8],
  [4, 11],
];
