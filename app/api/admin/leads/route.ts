import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

function isAuthorized(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  const adminPassword = process.env.ADMIN_PASSWORD;
  return !!adminPassword && token === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching leads:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
