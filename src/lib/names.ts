export const ADJECTIVES = [
  "bold", "free", "sly", "pure", "quiet", "wise", "calm", "deep", "fair",
  "rare", "keen", "brave", "swift", "lone", "kind", "warm", "cool", "soft",
  "bright", "sharp", "noble", "humble", "eager", "merry", "gentle", "vivid",
  "lucky", "wild", "sleek", "proud", "spry", "nimble", "snug", "crisp",
  "fleet", "stout", "trusty", "zesty", "jolly", "plucky", "sunny", "witty",
  "fuzzy", "breezy", "dapper", "frisky", "glossy", "mellow", "perky", "sturdy",
] as const;

export const ANIMALS = [
  "jay", "swan", "owl", "hawk", "lynx", "finch", "deer", "mink", "crow",
  "bass", "seal", "elk", "dove", "moth", "fox", "wolf", "bear", "otter",
  "hare", "newt", "wren", "lark", "toad", "vole", "stag", "ibex", "puma",
  "kite", "carp", "pike", "shrew", "marten", "stoat", "heron", "egret",
  "raven", "robin", "quail", "crane", "bison", "moose", "gecko", "viper",
  "skink", "ferret", "badger", "weasel", "beaver", "marmot", "elephant",
] as const;

export type Identity = { adjective: string; animal: string };

export function randomIdentity(rand: () => number = Math.random): Identity {
  const adjective = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(rand() * ANIMALS.length)];
  return { adjective, animal };
}

export function identityLabel(id: Identity): string {
  return `${id.adjective} ${id.animal}`;
}
