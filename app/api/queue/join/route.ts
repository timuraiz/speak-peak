import { NextRequest, NextResponse } from 'next/server';
import { joinQueue } from '@/app/lib/matchingStore';

export async function POST(req: NextRequest) {
  const { userId, name } = await req.json();

  if (!userId || !name) {
    return NextResponse.json({ error: 'userId and name are required' }, { status: 400 });
  }

  const result = joinQueue(userId, name);
  return NextResponse.json(result);
}
