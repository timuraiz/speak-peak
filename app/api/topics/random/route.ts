import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('topics')
    .select('id, title, meta');

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }

  const topic = data[Math.floor(Math.random() * data.length)];
  return NextResponse.json(topic);
}
