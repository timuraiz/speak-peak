import { NextRequest, NextResponse } from 'next/server';
import { leaveQueue, leaveRoom } from '@/app/lib/matchingStore';

export async function POST(req: NextRequest) {
  const { userId, roomId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  if (roomId) {
    leaveRoom(userId);
  } else {
    leaveQueue(userId);
  }

  return NextResponse.json({ ok: true });
}
