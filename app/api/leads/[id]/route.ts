import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase.from('leads').update(body).eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating lead:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
