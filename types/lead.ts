export interface LeadData {
  id?: string;
  nome: string;
  perfil: string;
  momento_operacao: string;
  faturamento_atual: string;
  principal_necessidade: string;
  objetivo_faturamento: string;
  investimento: string;
  whatsapp: string;
  instagram: string;
  email: string;
  status_lead: string;
  clicou_agendamento: boolean;
  agendou_reuniao: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  meta_fbp: string;
  meta_fbc: string;
  created_at?: string;
  observacoes?: string;
}

export type LeadUpdate = Partial<LeadData>;
