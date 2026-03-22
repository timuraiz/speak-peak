import { NextRequest, NextResponse } from 'next/server';
import { joinQueue, getPartner } from '@/app/lib/matchingStore';

export async function POST(req: NextRequest) {
  const { userId, name, avatar } = await req.json();

  if (!userId || !name) {
    return NextResponse.json({ error: 'userId and name are required' }, { status: 400 });
  }

  const result = await joinQueue(userId, name, avatar ?? null);

  if (result.matched && result.roomId) {
    const partner = await getPartner(result.roomId, userId);
    return NextResponse.json({ ...result, partner });
  }

  return NextResponse.json(result);
}
