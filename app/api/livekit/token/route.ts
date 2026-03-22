import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get('roomId');
  const userId = req.nextUrl.searchParams.get('userId');
  const name = req.nextUrl.searchParams.get('name') ?? 'User';

  if (!roomId || !userId) {
    return NextResponse.json({ error: 'roomId and userId are required' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'LiveKit not configured' }, { status: 500 });
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: userId,
    name,
    ttl: '2h',
  });

  token.addGrant({
    room: roomId,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return NextResponse.json({ token: await token.toJwt(), url: process.env.LIVEKIT_URL });
}
