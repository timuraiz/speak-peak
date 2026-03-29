import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const PRESENCE_KEY = 'speak:presence';
const TTL_MS = 30_000;

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const now = Date.now();
  await Promise.all([
    redis.zadd(PRESENCE_KEY, { score: now, member: userId }),
    redis.zremrangebyscore(PRESENCE_KEY, 0, now - TTL_MS),
  ]);

  const count = await redis.zcard(PRESENCE_KEY);
  return NextResponse.json({ count });
}
