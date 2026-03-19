import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { getAddress, isAddress } from "viem";

export const dynamic = "force-dynamic";

const REDIS_KEY = "road_escape:leaderboard";
const MAX_SCORE = 99_999_999;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export type LeaderboardEntry = { rank: number; address: string; score: number };

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ entries: [] as LeaderboardEntry[], configured: false });
  }

  const raw = await redis.zrange(REDIS_KEY, 0, 49, { rev: true, withScores: true });
  const entries: LeaderboardEntry[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    const address = String(raw[i]);
    const score = Number(raw[i + 1]);
    if (!Number.isFinite(score)) continue;
    entries.push({ rank: entries.length + 1, address, score });
  }

  return NextResponse.json({ entries, configured: true });
}

export async function POST(req: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Leaderboard not configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const addressRaw = b.address;
  const scoreRaw = b.score;

  if (!addressRaw || !isAddress(String(addressRaw))) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }
  const address = getAddress(String(addressRaw));

  const sc = typeof scoreRaw === "number" ? scoreRaw : parseInt(String(scoreRaw), 10);
  if (!Number.isFinite(sc) || sc < 0 || sc > MAX_SCORE) {
    return NextResponse.json({ error: "Invalid score" }, { status: 400 });
  }

  const member = address.toLowerCase();
  const prev = await redis.zscore(REDIS_KEY, member);
  const prevNum = prev !== null && prev !== undefined ? Number(prev) : 0;

  if (sc > prevNum) {
    await redis.zadd(REDIS_KEY, { score: sc, member });
  }

  return NextResponse.json({ ok: true, updated: sc > prevNum, best: Math.max(prevNum, sc) });
}
