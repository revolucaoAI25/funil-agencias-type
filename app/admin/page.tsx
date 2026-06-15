'use client';

import { useEffect, useState, useCallback } from 'react';
import { LeadData } from '@/types/lead';

const KANBAN_COLUMNS = [
  { id: 'novo', label: 'Novo Lead', color: '#6366f1' },
  { id: 'baixo_investimento', label: 'Baixo Investimento', color: '#f59e0b' },
  { id: 'qualificado', label: 'Qualificado', color: '#10b981' },
  { id: 'clicou', label: 'Clicou Agendamento', color: '#3b82f6' },
  { id: 'agendou', label: 'Reunião Agendada', color: '#25D366' },
  { id: 'curso_197', label: 'Curso R$197', color: '#ef4444' },
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

interface LeadModalProps {
  lead: LeadData;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

function LeadModal({ lead, onClose, onStatusChange }: LeadModalProps) {
  const fields: [string, string | boolean | undefined][] = [
    ['Nome', lead.nome],
    ['WhatsApp', lead.whatsapp],
    ['Instagram', lead.instagram],
    ['E-mail', lead.email],
    ['Perfil', lead.perfil],
    ['Momento', lead.momento_operacao],
    ['Faturamento atual', lead.faturamento_atual],
    ['Principal necessidade', lead.principal_necessidade],
    ['Objetivo de faturamento', lead.objetivo_faturamento],
    ['Investimento', lead.investimento],
    ['Status', lead.status_lead],
    ['Clicou agendamento', lead.clicou_agendamento ? 'Sim' : 'Não'],
    ['Agendou reunião', lead.agendou_reuniao ? 'Sim' : 'Não'],
    ['UTM Source', lead.utm_source],
    ['UTM Medium', lead.utm_medium],
    ['UTM Campaign', lead.utm_campaign],
    ['UTM Content', lead.utm_content],
    ['UTM Term', lead.utm_term],
    ['Data', formatDate(lead.created_at)],
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-[#2a2a2a]">
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <h2 className="text-white font-semibold">{lead.nome || 'Lead'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {fields.map(([label, value]) =>
            value ? (
              <div key={label} className="flex gap-2">
                <span className="text-gray-400 text-xs min-w-36 flex-shrink-0">{label}:</span>
                <span className="text-white text-xs break-all">{String(value)}</span>
              </div>
            ) : null
          )}
          <div className="pt-3 border-t border-[#2a2a2a]">
            <label className="text-gray-400 text-xs block mb-1">Alterar status:</label>
            <select
              value={lead.status_lead}
              onChange={(e) => lead.id && onStatusChange(lead.id, e.target.value)}
              className="bg-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm w-full outline-none border border-[#3a3a3a]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
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
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setLeads([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchLeads();
  }, [authenticated, fetchLeads]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status_lead: status } : l)));
    setSelectedLead((l) => (l?.id === id ? { ...l, status_lead: status } : l));
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q || [l.nome, l.whatsapp, l.email, l.instagram].some((v) => v?.toLowerCase().includes(q));
    const matchStatus = !statusFilter || l.status_lead === statusFilter;
    const matchFrom = !dateFrom || (l.created_at && l.created_at >= dateFrom);
    const matchTo = !dateTo || (l.created_at && l.created_at <= dateTo + 'T23:59:59');
    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  const exportCSV = () => {
    const headers = [
      'Nome', 'WhatsApp', 'Instagram', 'Email', 'Perfil', 'Momento',
      'Faturamento', 'Necessidade', 'Objetivo', 'Investimento', 'Status',
      'Clicou', 'Agendou', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Data',
    ];
    const rows = filteredLeads.map((l) => [
      l.nome, l.whatsapp, l.instagram, l.email, l.perfil, l.momento_operacao,
      l.faturamento_atual, l.principal_necessidade, l.objetivo_faturamento,
      l.investimento, l.status_lead,
      l.clicou_agendamento ? 'Sim' : 'Não',
      l.agendou_reuniao ? 'Sim' : 'Não',
      l.utm_source, l.utm_medium, l.utm_campaign, formatDate(l.created_at),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v || ''}"`).join(','))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <form
          onSubmit={handleAuth}
          className="bg-[#111111] rounded-2xl p-8 w-full max-w-sm border border-[#2a2a2a]"
        >
          <h1 className="text-white text-xl font-bold mb-2 text-center">Admin</h1>
          <p className="text-gray-400 text-sm text-center mb-6">Revolução AI</p>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#25D366] mb-3 border border-[#2a2a2a]"
          />
          {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
          <button
            type="submit"
            className="w-full bg-[#25D366] text-white font-semibold rounded-xl px-4 py-3 text-sm hover:bg-[#1fad52] transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 bg-[#111111] border-b border-[#2a2a2a] px-4 py-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">Dashboard — Leads</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchLeads}
              className="bg-[#1e1e1e] text-gray-300 rounded-lg px-3 py-1.5 text-xs hover:bg-[#2a2a2a] border border-[#2a2a2a]"
            >
              Atualizar
            </button>
            <button
              onClick={exportCSV}
              className="bg-[#25D366] text-white rounded-lg px-3 py-1.5 text-xs hover:bg-[#1fad52]"
            >
              Exportar CSV
            </button>
            <button
              onClick={() => { localStorage.removeItem('adminAuth'); setAuthenticated(false); }}
              className="bg-[#1e1e1e] text-gray-400 rounded-lg px-3 py-1.5 text-xs hover:bg-[#2a2a2a] border border-[#2a2a2a]"
            >
              Sair
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar nome, telefone, email, instagram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1e1e1e] text-white placeholder-gray-500 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[#25D366] flex-1 min-w-40 border border-[#2a2a2a]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1e1e1e] text-white rounded-lg px-3 py-1.5 text-xs outline-none border border-[#2a2a2a]"
          >
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-[#1e1e1e] text-white rounded-lg px-3 py-1.5 text-xs outline-none border border-[#2a2a2a]"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-[#1e1e1e] text-white rounded-lg px-3 py-1.5 text-xs outline-none border border-[#2a2a2a]"
          />
        </div>
        <p className="text-gray-500 text-xs mt-2">{filteredLeads.length} leads</p>
      </div>

      {/* Kanban */}
      <div className="p-4 overflow-x-auto">
        {loading ? (
          <p className="text-gray-400 text-center py-12">Carregando...</p>
        ) : (
          <div className="flex gap-4 min-w-max pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const colLeads = getColumnLeads(filteredLeads, col.id);
              return (
                <div key={col.id} className="w-64 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <h2 className="text-xs font-semibold text-gray-300">{col.label}</h2>
                    <span className="ml-auto bg-[#1e1e1e] text-gray-500 text-xs rounded-full px-2 py-0.5">
                      {colLeads.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {colLeads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl p-3 text-left hover:border-[#3a3a3a] transition-colors"
                      >
                        <p className="text-white text-xs font-medium truncate">
                          {lead.nome || 'Sem nome'}
                        </p>
                        {lead.whatsapp && (
                          <p className="text-gray-400 text-xs mt-1">{lead.whatsapp}</p>
                        )}
                        {lead.email && (
                          <p className="text-gray-500 text-xs truncate">{lead.email}</p>
                        )}
                        {lead.investimento && (
                          <p className="text-xs mt-1.5 font-medium" style={{ color: col.color }}>
                            {lead.investimento}
                          </p>
                        )}
                        <p className="text-gray-600 text-xs mt-1.5">{formatDate(lead.created_at)}</p>
                      </button>
                    ))}
                    {colLeads.length === 0 && (
                      <p className="text-gray-700 text-xs text-center py-6 border border-dashed border-[#2a2a2a] rounded-xl">
                        Vazio
                      </p>
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
