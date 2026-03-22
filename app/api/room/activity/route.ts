import { NextRequest, NextResponse } from 'next/server';
import { setRoomActivity, getRoomActivity } from '@/app/lib/matchingStore';

export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get('roomId');
  if (!roomId) return NextResponse.json({ error: 'roomId is required' }, { status: 400 });

  const activity = await getRoomActivity(roomId);
  return NextResponse.json({ activity });
}

export async function POST(req: NextRequest) {
  const { roomId, activity } = await req.json();
  if (!roomId) return NextResponse.json({ error: 'roomId is required' }, { status: 400 });

  await setRoomActivity(roomId, activity);
  return NextResponse.json({ ok: true });
}
