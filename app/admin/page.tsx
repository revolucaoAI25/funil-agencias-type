'use client';

import { useEffect, useState, useCallback } from 'react';
import { LeadData } from '@/types/lead';

const KANBAN_COLUMNS = [
  { id: 'novo', label: 'Novo Lead', color: '#6366f1', bg: '#6366f115' },
  { id: 'baixo_investimento', label: 'Baixo Investimento', color: '#f59e0b', bg: '#f59e0b15' },
  { id: 'qualificado', label: 'Qualificado', color: '#10b981', bg: '#10b98115' },
  { id: 'clicou', label: 'Clicou Agendamento', color: '#3b82f6', bg: '#3b82f615' },
  { id: 'agendou', label: 'Reunião Agendada', color: '#25D366', bg: '#25D36615' },
  { id: 'curso_197', label: 'Curso R$197', color: '#ef4444', bg: '#ef444415' },
];

const STATUS_OPTIONS = ['novo', 'baixo_investimento', 'qualificado', 'curso_197'];

function getColumnLeads(leads: LeadData[], columnId: string): LeadData[] {
  if (columnId === 'clicou') return leads.filter((l) => l.clicou_agendamento);
  if (columnId === 'agendou') return leads.filter((l) => l.agendou_reuniao);
  return leads.filter((l) => l.status_lead === columnId);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: string }) {
  const col = KANBAN_COLUMNS.find((c) => c.id === status);
  const color = col?.color || '#888';
  const bg = col?.bg || '#88888815';
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: bg, border: `1px solid ${color}33` }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

interface LeadModalProps {
  lead: LeadData;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

function LeadModal({ lead, onClose, onStatusChange }: LeadModalProps) {
  const rows: [string, string][] = [
    ['Nome', lead.nome || ''],
    ['WhatsApp', lead.whatsapp || ''],
    ['Instagram', lead.instagram || ''],
    ['E-mail', lead.email || ''],
    ['Perfil', lead.perfil || ''],
    ['Momento da operação', lead.momento_operacao || ''],
    ['Faturamento atual', lead.faturamento_atual || ''],
    ['Principal necessidade', lead.principal_necessidade || ''],
    ['Objetivo de faturamento', lead.objetivo_faturamento || ''],
    ['Investimento', lead.investimento || ''],
    ['Status', lead.status_lead || ''],
    ['Clicou agendamento', lead.clicou_agendamento ? 'Sim' : 'Não'],
    ['Agendou reunião', lead.agendou_reuniao ? 'Sim' : 'Não'],
    ['UTM Source', lead.utm_source || ''],
    ['UTM Medium', lead.utm_medium || ''],
    ['UTM Campaign', lead.utm_campaign || ''],
    ['UTM Content', lead.utm_content || ''],
    ['UTM Term', lead.utm_term || ''],
    ['Data', formatDate(lead.created_at)],
  ].filter(([, v]) => v && v !== 'Não') as [string, string][];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#141618] rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden border border-[#2a2a2a] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <div>
            <h2 className="text-white font-semibold">{lead.nome || 'Lead'}</h2>
            <StatusBadge status={lead.status_lead || 'novo'} />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#3a3a3a] transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[#666] text-[11px] uppercase tracking-wide font-medium">{label}</span>
              <span className="text-[#e0e0e0] text-sm">{value}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-[#2a2a2a] mt-3">
            <label className="text-[#666] text-[11px] uppercase tracking-wide font-medium block mb-2">Alterar status</label>
            <select
              value={lead.status_lead || 'novo'}
              onChange={(e) => onStatusChange(lead.id!, e.target.value)}
              className="bg-[#1e1e1e] text-white rounded-xl px-3 py-2.5 text-sm w-full outline-none border border-[#2a2a2a] focus:border-[#25D366] transition-colors"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/leads');
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchLeads();
  }, [authenticated, fetchLeads]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      localStorage.setItem('adminAuth', 'true');
      setAuthenticated(true);
    } else {
      setAuthError('Senha incorreta');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_lead: status }),
    });
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status_lead: status } : l));
    if (selectedLead?.id === id) setSelectedLead((l) => l ? { ...l, status_lead: status } : l);
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || [l.nome, l.whatsapp, l.email, l.instagram].some((v) => v?.toLowerCase().includes(q));
    const matchStatus = !statusFilter || l.status_lead === statusFilter;
    const matchFrom = !dateFrom || (l.created_at && l.created_at >= dateFrom);
    const matchTo = !dateTo || (l.created_at && l.created_at <= dateTo + 'T23:59:59');
    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  const exportCSV = () => {
    const headers = ['Nome', 'WhatsApp', 'Instagram', 'Email', 'Perfil', 'Momento', 'Faturamento', 'Necessidade', 'Objetivo', 'Investimento', 'Status', 'Clicou', 'Agendou', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Data'];
    const rows = filteredLeads.map((l) => [
      l.nome, l.whatsapp, l.instagram, l.email, l.perfil, l.momento_operacao,
      l.faturamento_atual, l.principal_necessidade, l.objetivo_faturamento,
      l.investimento, l.status_lead,
      l.clicou_agendamento ? 'Sim' : 'Não',
      l.agendou_reuniao ? 'Sim' : 'Não',
      l.utm_source, l.utm_medium, l.utm_campaign, formatDate(l.created_at),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-[#25D366]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/avatar.jpg" alt="" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <h1 className="text-white text-lg font-bold">Revolução AI</h1>
            <p className="text-[#666] text-sm mt-1">Dashboard administrativo</p>
          </div>
          <form onSubmit={handleAuth} className="bg-[#141618] rounded-2xl p-6 border border-[#2a2a2a] shadow-2xl">
            <label className="text-[#888] text-xs uppercase tracking-wide font-medium block mb-2">Senha de acesso</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full bg-[#0d0d0d] text-white placeholder-[#444] rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#25D366] border border-[#2a2a2a] mb-3 transition-all"
            />
            {authError && (
              <p className="text-red-400 text-xs mb-3 flex items-center gap-1">
                <span>⚠</span> {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-[#25D366] text-white font-semibold rounded-xl px-4 py-3 text-sm hover:bg-[#20bf5a] hover:shadow-lg hover:shadow-[#25D36633] transition-all active:scale-[0.98]"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalLeads = filteredLeads.length;
  const qualificados = filteredLeads.filter((l) => l.status_lead === 'qualificado').length;
  const agendados = filteredLeads.filter((l) => l.agendou_reuniao).length;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="sticky top-0 bg-[#141618] border-b border-[#2a2a2a] z-10 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-bold text-lg">Dashboard de Leads</h1>
              <p className="text-[#666] text-xs mt-0.5">Revolução AI — @lucasmag.ai</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchLeads}
                className="bg-[#1e1e1e] text-[#aaa] hover:text-white rounded-xl px-3 py-2 text-xs font-medium hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
              >
                ↻ Atualizar
              </button>
              <button
                onClick={exportCSV}
                className="bg-[#25D366] text-white rounded-xl px-3 py-2 text-xs font-semibold hover:bg-[#20bf5a] transition-colors"
              >
                ↓ CSV
              </button>
              <button
                onClick={() => { localStorage.removeItem('adminAuth'); setAuthenticated(false); }}
                className="bg-[#1e1e1e] text-[#aaa] hover:text-white rounded-xl px-3 py-2 text-xs font-medium hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-4">
            <div className="bg-[#1e1e1e] rounded-xl px-4 py-2 border border-[#2a2a2a]">
              <p className="text-[#666] text-[10px] uppercase tracking-wide">Total</p>
              <p className="text-white font-bold text-lg">{totalLeads}</p>
            </div>
            <div className="bg-[#1e1e1e] rounded-xl px-4 py-2 border border-[#2a2a2a]">
              <p className="text-[#666] text-[10px] uppercase tracking-wide">Qualificados</p>
              <p className="text-[#10b981] font-bold text-lg">{qualificados}</p>
            </div>
            <div className="bg-[#1e1e1e] rounded-xl px-4 py-2 border border-[#2a2a2a]">
              <p className="text-[#666] text-[10px] uppercase tracking-wide">Agendados</p>
              <p className="text-[#25D366] font-bold text-lg">{agendados}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="🔍 Buscar nome, WhatsApp, e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1e1e1e] text-white placeholder-[#555] rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#25D366] flex-1 min-w-48 border border-[#2a2a2a] transition-all"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1e1e1e] text-[#ccc] rounded-xl px-3 py-2 text-sm outline-none border border-[#2a2a2a] focus:ring-1 focus:ring-[#25D366]"
            >
              <option value="">Todos os status</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-[#1e1e1e] text-[#ccc] rounded-xl px-3 py-2 text-sm outline-none border border-[#2a2a2a]"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-[#1e1e1e] text-[#ccc] rounded-xl px-3 py-2 text-sm outline-none border border-[#2a2a2a]"
            />
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="p-6 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-[#666]">
            <div className="w-5 h-5 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Carregando leads...</span>
          </div>
        ) : (
          <div className="flex gap-4 min-w-max pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const colLeads = getColumnLeads(filteredLeads, col.id);
              return (
                <div key={col.id} className="w-72 flex-shrink-0">
                  {/* Column header */}
                  <div
                    className="flex items-center gap-2 mb-3 px-3 py-2.5 rounded-xl border"
                    style={{ backgroundColor: col.bg, borderColor: col.color + '33' }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                    <h2 className="text-sm font-semibold flex-1" style={{ color: col.color }}>{col.label}</h2>
                    <span
                      className="text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                      style={{ backgroundColor: col.color + '22', color: col.color }}
                    >
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {colLeads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="w-full bg-[#141618] border border-[#2a2a2a] rounded-xl p-3.5 text-left hover:border-[#3a3a3a] hover:bg-[#1a1c1f] transition-all group shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-white text-sm font-semibold leading-tight group-hover:text-[#25D366] transition-colors">
                            {lead.nome || 'Sem nome'}
                          </p>
                          {lead.agendou_reuniao && (
                            <span className="text-[#25D366] text-xs flex-shrink-0">✓</span>
                          )}
                        </div>
                        {lead.whatsapp && (
                          <p className="text-[#888] text-xs mb-0.5 flex items-center gap-1">
                            <span className="text-[#555]">📱</span> {lead.whatsapp}
                          </p>
                        )}
                        {lead.email && (
                          <p className="text-[#888] text-xs mb-0.5 truncate flex items-center gap-1">
                            <span className="text-[#555]">✉</span> {lead.email}
                          </p>
                        )}
                        {lead.investimento && (
                          <p
                            className="text-xs mt-2 font-medium"
                            style={{ color: col.color }}
                          >
                            {lead.investimento}
                          </p>
                        )}
                        <p className="text-[#444] text-[10px] mt-2">{formatDate(lead.created_at)}</p>
                      </button>
                    ))}
                    {colLeads.length === 0 && (
                      <div className="text-[#333] text-xs text-center py-8 border border-dashed border-[#222] rounded-xl">
                        Nenhum lead
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
