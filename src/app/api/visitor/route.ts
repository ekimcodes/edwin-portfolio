import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";
import { randomIdentity } from "@/lib/names";
import { readGeo } from "@/lib/geo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRESENCE_KEY = "presence";
const LOG_KEY = "visitors:log";
const COOKIE = "visitor_id";

type VisitorRecord = {
  adjective: string;
  animal: string;
  city: string;
  region: string;
  country: string;
  firstSeen: string;
  lastSeen: string;
};

async function touchPresence(id: string) {
  const now = Date.now();
  await redis.zadd(PRESENCE_KEY, { score: now, member: id });
  await redis.zremrangebyscore(PRESENCE_KEY, 0, now - 60_000);
}

export async function GET() {
  const jar = await cookies();
  const existingId = jar.get(COOKIE)?.value;

  if (existingId) {
    const rec = (await redis.hgetall(
      `visitor:${existingId}`
    )) as VisitorRecord | null;
    if (rec && rec.adjective) {
      await redis.hset(`visitor:${existingId}`, { lastSeen: String(Date.now()) });
      await touchPresence(existingId);
      return NextResponse.json({ id: existingId, ...rec });
    }
  }

  // New visitor
  const id = nanoid(12);
  const identity = randomIdentity();
  const geo = await readGeo();
  const now = Date.now();
  const record: VisitorRecord = {
    adjective: identity.adjective,
    animal: identity.animal,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    firstSeen: String(now),
    lastSeen: String(now),
  };

  await redis.hset(`visitor:${id}`, record);
  await redis.zadd(LOG_KEY, { score: now, member: id });
  await touchPresence(id);

  const res = NextResponse.json({ id, ...record });
  res.cookies.set(COOKIE, id, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
