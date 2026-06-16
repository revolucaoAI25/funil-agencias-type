import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

function isAuthorized(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  const adminPassword = process.env.ADMIN_PASSWORD;
  return !!adminPassword && token === adminPassword;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    // Only allow status_lead to be changed from admin panel
    const { status_lead } = body;
    if (!status_lead) {
      return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('leads')
      .update({ status_lead })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating lead:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
