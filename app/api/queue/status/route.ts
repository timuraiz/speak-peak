import { NextRequest, NextResponse } from 'next/server';
import { getMatchStatus, getPartner } from '@/app/lib/matchingStore';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const status = getMatchStatus(userId);

  if (status.matched && status.roomId) {
    const partner = getPartner(status.roomId, userId);
    return NextResponse.json({ matched: true, roomId: status.roomId, isLeader: status.isLeader, partner });
  }

  return NextResponse.json({ matched: false });
}
