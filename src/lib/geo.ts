import { headers } from "next/headers";

export type Geo = { city: string; region: string; country: string };

const decode = (v: string | null) => (v ? decodeURIComponent(v) : "");

export async function readGeo(): Promise<Geo> {
  const h = await headers();
  const city = decode(h.get("x-vercel-ip-city"));
  const region = decode(h.get("x-vercel-ip-country-region"));
  const country = decode(h.get("x-vercel-ip-country"));
  return {
    city: city || "localhost",
    region: region || "",
    country: country || "",
  };
}

export function geoLabel(g: Geo): string {
  const parts = [g.city, g.region].filter(Boolean).map((s) => s.toLowerCase());
  return parts.join(", ") || "somewhere";
}
