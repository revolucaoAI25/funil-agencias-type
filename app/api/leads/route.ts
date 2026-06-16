import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const ALLOWED_FIELDS = [
  'nome', 'perfil', 'momento_operacao', 'faturamento_atual',
  'principal_necessidade', 'objetivo_faturamento', 'investimento',
  'status_lead', 'whatsapp', 'instagram', 'email',
  'clicou_agendamento', 'agendou_reuniao',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'meta_fbp', 'meta_fbc',
] as const;

function pickAllowed(body: Record<string, unknown>) {
  return Object.fromEntries(
    ALLOWED_FIELDS.filter((k) => k in body).map((k) => [k, body[k]])
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServiceClient();

    if (!supabase) {
      return NextResponse.json({ id: 'dev-' + Date.now() });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([pickAllowed(body)])
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
