import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOG_KEY = "visitors:log";

export async function GET() {
  const ids = (await redis.zrange(LOG_KEY, 0, 199, { rev: true })) as string[];
  if (ids.length === 0) return NextResponse.json({ visitors: [] });

  const pipeline = redis.pipeline();
  ids.forEach((id) => pipeline.hgetall(`visitor:${id}`));
  const records = (await pipeline.exec()) as Array<Record<
    string,
    string
  > | null>;

  const visitors = records
    .map((r, i) =>
      r && r.adjective
        ? {
            id: ids[i],
            adjective: r.adjective,
            animal: r.animal,
            city: r.city,
            region: r.region,
            firstSeen: Number(r.firstSeen),
          }
        : null
    )
    .filter(Boolean);

  return NextResponse.json({ visitors });
}
