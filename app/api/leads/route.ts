import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({ id: 'dev-' + Date.now() });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([body])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error('Error creating lead:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
