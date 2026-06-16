import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const ALLOWED_FIELDS = [
  'perfil', 'momento_operacao', 'faturamento_atual',
  'principal_necessidade', 'objetivo_faturamento', 'investimento',
  'status_lead', 'whatsapp', 'instagram', 'email',
  'clicou_agendamento', 'agendou_reuniao',
] as const;

function pickAllowed(body: Record<string, unknown>) {
  return Object.fromEntries(
    ALLOWED_FIELDS.filter((k) => k in body).map((k) => [k, body[k]])
  );
}

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

    const updates = pickAllowed(body);
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase.from('leads').update(updates).eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating lead:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
