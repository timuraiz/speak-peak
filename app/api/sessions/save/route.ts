import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

export async function POST(request: NextRequest) {
  const { duration_seconds } = await request.json();
  if (!duration_seconds || duration_seconds < 1) {
    return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase.from('call_sessions').insert({
    user_id: user.id,
    duration_seconds,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
