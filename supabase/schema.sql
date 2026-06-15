create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  nome text,
  perfil text,
  momento_operacao text,
  faturamento_atual text,
  principal_necessidade text,
  objetivo_faturamento text,
  investimento text,
  whatsapp text,
  instagram text,
  email text,
  status_lead text default 'novo',
  clicou_agendamento boolean default false,
  agendou_reuniao boolean default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  meta_fbp text,
  meta_fbc text,
  created_at timestamp with time zone default now(),
  observacoes text
);

-- Enable RLS
alter table leads enable row level security;

-- Policy for service role (full access)
create policy "Service role has full access" on leads
  for all using (true);
