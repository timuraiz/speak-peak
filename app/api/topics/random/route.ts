import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('topics')
    .select('id, title, meta')
    .order('random()' as never)
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 });
  }

  return NextResponse.json(data);
}
