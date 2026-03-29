import { NextResponse } from 'next/server';
import { getQueueStats } from '@/app/lib/matchingStore';

export async function GET() {
  const stats = await getQueueStats();
  return NextResponse.json(stats);
}
