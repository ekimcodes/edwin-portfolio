import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRESENCE_KEY = "presence";
const WINDOW_MS = 30_000;

export async function POST() {
  const id = (await cookies()).get("visitor_id")?.value;
  const now = Date.now();
  if (id) {
    await redis.zadd(PRESENCE_KEY, { score: now, member: id });
  }
  await redis.zremrangebyscore(PRESENCE_KEY, 0, now - 60_000);
  const count = await redis.zcount(PRESENCE_KEY, now - WINDOW_MS, "+inf");
  return NextResponse.json({ count });
}

export async function GET() {
  const now = Date.now();
  const count = await redis.zcount(PRESENCE_KEY, now - WINDOW_MS, "+inf");
  return NextResponse.json({ count });
}
