'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';
import ChoiceButtons from '@/components/ChoiceButtons';
import ContactForm from '@/components/ContactForm';
import CalendlyModal from '@/components/CalendlyModal';
import { trackLead, getCookieValue } from '@/lib/pixel';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

type InputMode = 'text' | 'choice' | 'contacts' | 'calendly_btn' | 'curso_btn' | null;

const QUALIFIED_INVESTMENTS = ['De R$3 mil a R$6 mil', 'De R$6 mil a R$10 mil', 'Acima de R$10 mil'];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const [choiceOptions, setChoiceOptions] = useState<string[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [textInput, setTextInput] = useState('');

  const leadId = useRef<string | null>(null);
  const leadData = useRef({
    nome: '',
    perfil: '',
    momento_operacao: '',
    faturamento_atual: '',
    principal_necessidade: '',
    objetivo_faturamento: '',
    investimento: '',
    status_lead: 'novo',
    whatsapp: '',
    instagram: '',
    email: '',
    clicou_agendamento: false,
    agendou_reuniao: false,
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    meta_fbp: '',
    meta_fbc: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRunning = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping, inputMode, scrollToBottom]);

  const addBotMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text, isUser: false }]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text, isUser: true }]);
  }, []);

  const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const showBotMessages = useCallback(
    async (msgs: string[], firstInstant = false) => {
      for (let i = 0; i < msgs.length; i++) {
        if (i === 0 && firstInstant) {
          addBotMessage(msgs[i]);
        } else {
          setShowTyping(true);
          await delay(1500);
          setShowTyping(false);
          addBotMessage(msgs[i]);
          await delay(80);
        }
      }
    },
    [addBotMessage]
  );

  const createLead = useCallback(async () => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData.current),
      });
      const data = await res.json();
      if (data.id) leadId.current = data.id;
    } catch (e) {
      console.error('Error creating lead:', e);
    }
  }, []);

  const updateLead = useCallback(async (updates: Record<string, unknown>) => {
    Object.assign(leadData.current, updates);
    if (leadId.current) {
      try {
        await fetch(`/api/leads/${leadId.current}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      } catch (e) {
        console.error('Error updating lead:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      leadData.current.utm_source = params.get('utm_source') || '';
      leadData.current.utm_medium = params.get('utm_medium') || '';
      leadData.current.utm_campaign = params.get('utm_campaign') || '';
      leadData.current.utm_content = params.get('utm_content') || '';
      leadData.current.utm_term = params.get('utm_term') || '';
      leadData.current.meta_fbp = getCookieValue('_fbp');
      leadData.current.meta_fbc = getCookieValue('_fbc');
    }
  }, []);

  const runBranchMessages = useCallback(
    async (nome: string, perfil: string) => {
      const branches: Record<string, string[]> = {
        'Já sei implementar IA, mas preciso vender mais': [
          `Boa, ${nome}.`,
          'Nesse caso, o principal ponto é transformar sua capacidade técnica em uma oferta vendável, com aquisição, posicionamento, qualificação, reunião comercial, proposta e fechamento high ticket.',
          'Na Revolução AI, eu estruturei esse processo dentro da própria agência para vender agentes de IA para empresas com previsibilidade e percepção de valor alta.',
        ],
        'Já sei vender, mas preciso aprender a entregar IA': [
          `Boa, ${nome}.`,
          'Nesse caso, o principal ponto é ter uma entrega validada para colocar no mercado com segurança.',
          'A Revolução AI já realizou mais de 100 implementações reais e desenvolveu uma metodologia para construir agentes de IA com padrão, velocidade e qualidade.',
          'Na reunião, eu vou entender seu cenário e mostrar como essa entrega pode virar uma oferta high ticket para empresas.',
        ],
        'Quero aprender venda e entrega do zero': [
          `Perfeito, ${nome}.`,
          'Nesse caso, o caminho precisa ser completo.',
          'Você precisa entender qual oferta vender, como gerar oportunidades, como conduzir vendas, como construir os agentes e como organizar a entrega.',
          'É exatamente esse processo que a Revolução AI estruturou: oferta, aquisição, vendas, entrega e operação.',
        ],
        'Já tenho operação de IA e quero escalar': [
          `Boa, ${nome}.`,
          'Nesse caso, a reunião precisa olhar para os gargalos de escala.',
          'Pode ser aquisição, conversão, ticket, entrega, operação ou padronização.',
          'A Revolução AI cresceu porque transformou a entrega de agentes de IA em uma metodologia comercial e operacional replicável, aplicada em mais de 100 operações reais.',
        ],
        'Tenho agência de marketing/tráfego e quero entrar em IA': [
          `Boa, ${nome}.`,
          'Esse é um dos caminhos mais fortes.',
          'Quem já entende de tráfego, geração de leads e venda de serviços pode usar agentes de IA como uma nova oferta high ticket para empresas que já recebem oportunidades, mas precisam converter mais.',
          'Na reunião, eu vou te mostrar como essa solução pode entrar na sua operação com uma metodologia validada de venda e entrega.',
        ],
      };
      await showBotMessages(branches[perfil] || [`Boa, ${nome}.`]);
    },
    [showBotMessages]
  );

  const waitForChoice = (): Promise<string> =>
    new Promise((resolve) => {
      (window as Window & { __funnelResolveChoice?: (v: string) => void }).__funnelResolveChoice = resolve;
    });

  const runFunnel = useCallback(async () => {
    if (isRunning.current) return;
    isRunning.current = true;

    // ── BLOCO 1 ────────────────────────────────────────────────────────────
    await showBotMessages(
      [
        'Quer faturar R$50 mil por mês com uma agência de IA em até 6 meses?',
        'Responda algumas perguntas rápidas e veja se faz sentido agendar uma reunião comigo, Lucas Magalhães, fundador da Revolução AI.',
        'Na call, eu vou analisar seu cenário e te mostrar um plano para vender e entregar agentes de IA high ticket para empresas usando a metodologia de uma das primeiras agências de IA do Brasil.',
        'Antes de começar, qual é seu nome?',
      ],
      true
    );
    setInputMode('text');

    const nome = await new Promise<string>((resolve) => {
      (window as Window & { __funnelResolveNome?: (v: string) => void }).__funnelResolveNome = resolve;
    });
    setInputMode(null);
    addUserMessage(nome);
    leadData.current.nome = nome;
    await createLead();

    // ── BLOCO 2 ────────────────────────────────────────────────────────────
    await showBotMessages([
      `Perfeito, ${nome}.`,
      'Eu sou fundador da Revolução AI, uma das primeiras agências de IA do Brasil.',
      'Desde 2023, a Revolução AI atua com IA aplicada a negócios e já realizou mais de 100 implementações reais em nichos como advocacia, saúde, estética, software, franquias, varejo e infoprodutos.',
      'Agora vamos entender seu momento para ver se faz sentido você conversar direto comigo.',
      'Qual opção mais combina com você hoje?',
    ]);
    setChoiceOptions([
      'Já sei implementar IA, mas preciso vender mais',
      'Já sei vender, mas preciso aprender a entregar IA',
      'Quero aprender venda e entrega do zero',
      'Já tenho operação de IA e quero escalar',
      'Tenho agência de marketing/tráfego e quero entrar em IA',
    ]);
    setInputMode('choice');

    const perfil = await waitForChoice();
    setInputMode(null);
    addUserMessage(perfil);
    await updateLead({ perfil });
    leadData.current.perfil = perfil;

    // ── BLOCO 3 — Ramificação ──────────────────────────────────────────────
    await runBranchMessages(nome, perfil);

    // ── BLOCO 4 ────────────────────────────────────────────────────────────
    await showBotMessages(['Como está sua operação hoje?']);
    setChoiceOptions([
      'Ainda estou começando',
      'Já estudo IA ou serviços digitais, mas ainda vendo pouco',
      'Já vendi alguns projetos',
      'Já tenho clientes ativos',
      'Já tenho operação rodando e quero escalar',
    ]);
    setInputMode('choice');

    const momento = await waitForChoice();
    setInputMode(null);
    addUserMessage(momento);
    await updateLead({ momento_operacao: momento });

    // ── BLOCO 5 ────────────────────────────────────────────────────────────
    await showBotMessages(['Quanto você fatura hoje por mês com IA, automação, tráfego ou serviços digitais?']);
    setChoiceOptions([
      'Ainda não faturo',
      'Até R$10 mil/mês',
      'De R$10 mil a R$30 mil/mês',
      'De R$30 mil a R$50 mil/mês',
      'Acima de R$50 mil/mês',
    ]);
    setInputMode('choice');

    const faturamento = await waitForChoice();
    setInputMode(null);
    addUserMessage(faturamento);
    await updateLead({ faturamento_atual: faturamento });

    // ── BLOCO 6 — Prova social ─────────────────────────────────────────────
    await showBotMessages([
      'Entendido.',
      'A metodologia da Revolução AI já foi aplicada em mais de 100 operações reais, passando por empresas, franquias, softwares, escritórios, clínicas, restaurantes, infoprodutores e influenciadores com grandes audiências.',
      'Alguns clientes e operações que já passaram pela Revolução AI:\n\nBubble Box — franqueadora com mais de 250 unidades no Brasil. Casoca — plataforma para arquitetos e designers com mais de 300 mil profissionais cadastrados. Patrícia Davidson — nutricionista influencer com mais de 3 milhões de seguidores. Dra. Ryuza Gonçalves — influencer de suplementação com mais de 700 mil seguidores. Tami Gerhardt — influenciadora de emagrecimento com mais de 450 mil seguidores. Willian Celso / Autêntica — referência em posicionamento de marca, com mais de 400 mil seguidores. Marcondes Madureira Advogados — escritório de Direito de Família com forte presença digital e mais de 380 mil seguidores. Guilherme Vazan — infoprodutor de impressão 3D com mais de 5 mil alunos. Guedes & Cruz Advogados — escritório de advocacia bancária com alto volume de leads. Kanpai BH — restaurante japonês premium em Belo Horizonte.',
      'Agora precisamos entender o principal ponto que está impedindo você de avançar mais rápido.',
    ]);

    // ── BLOCO 7 ────────────────────────────────────────────────────────────
    await showBotMessages(['Hoje, o que você mais precisa para crescer com IA?']);
    setChoiceOptions([
      'Aprender a construir agentes de IA',
      'Aprender a vender IA high ticket',
      'Ter uma oferta mais clara e vendável',
      'Gerar mais leads qualificados',
      'Vender com mais consistência',
      'Escalar minha operação atual',
    ]);
    setInputMode('choice');

    const necessidade = await waitForChoice();
    setInputMode(null);
    addUserMessage(necessidade);
    await updateLead({ principal_necessidade: necessidade });

    // ── BLOCO 8 — Cases ────────────────────────────────────────────────────
    await showBotMessages([
      'Esse é exatamente o tipo de ponto que eu analiso na reunião.',
      'Na Revolução AI, o crescimento veio de uma metodologia baseada em aquisição, venda e entrega.',
      'Esse método já foi aplicado em projetos reais para aumentar conversas, reuniões e agendamentos mantendo o mesmo investimento em tráfego.',
      'Alguns exemplos:\n\nPita Advocacia: de 10 para cerca de 50 reuniões/mês. Bubble Box: de 40 para 180 reuniões/mês. Dr. Paulo Bernardo: de 5 para 30 consultas/mês.',
      'Agora vamos entender sua meta.',
    ]);

    // ── BLOCO 9 ────────────────────────────────────────────────────────────
    await showBotMessages(['Qual faturamento mensal você quer atingir com sua agência de IA nos próximos 6 meses?']);
    setChoiceOptions([
      'Fazer as primeiras vendas',
      'R$10 mil/mês',
      'R$30 mil/mês',
      'R$50 mil/mês',
      'Acima de R$50 mil/mês',
    ]);
    setInputMode('choice');

    const objetivo = await waitForChoice();
    setInputMode(null);
    addUserMessage(objetivo);
    await updateLead({ objetivo_faturamento: objetivo });

    // ── BLOCO 10 ───────────────────────────────────────────────────────────
    await showBotMessages([
      'Para acelerar esse plano, quanto você estaria disposto a investir em uma mentoria com acompanhamento direto, método comercial, método de entrega, scripts, templates e direcionamento?',
    ]);
    setChoiceOptions([
      'Até R$3 mil',
      'De R$3 mil a R$6 mil',
      'De R$6 mil a R$10 mil',
      'Acima de R$10 mil',
      'Não consigo investir agora',
    ]);
    setInputMode('choice');

    const investimento = await waitForChoice();
    setInputMode(null);
    addUserMessage(investimento);

    let status = 'baixo_investimento';
    if (QUALIFIED_INVESTMENTS.includes(investimento)) status = 'qualificado';
    else if (investimento === 'Não consigo investir agora') status = 'curso_197';

    await updateLead({ investimento, status_lead: status });
    leadData.current.investimento = investimento;
    leadData.current.status_lead = status;

    // ── BLOCO 11B — Curso ──────────────────────────────────────────────────
    if (status === 'curso_197') {
      await showBotMessages([
        `Entendi, ${nome}.`,
        'Neste momento, o melhor próximo passo para você é começar por um treinamento mais simples e direto.',
        'Vou te enviar uma opção de entrada para você começar a entender como funciona o mercado de agentes de IA e dar os primeiros passos.',
      ]);
      setInputMode('curso_btn');
      isRunning.current = false;
      return;
    }

    // ── BLOCO 11A — Captura ────────────────────────────────────────────────
    await showBotMessages([
      `Perfeito, ${nome}.`,
      'Pelo que você respondeu, faz sentido você avançar para uma reunião comigo.',
      'Na call, eu vou analisar seu cenário e montar um plano para você estruturar sua agência de IA com base nos 5 pilares da metodologia da Revolução AI:',
      'oferta, aquisição, vendas, entrega e operação.',
      'A ideia é você sair da reunião com clareza sobre o caminho mais direto para vender e entregar agentes de IA high ticket para empresas.',
      'Antes de liberar a agenda, deixe seu contato para nossa equipe confirmar sua aplicação.',
    ]);
    setInputMode('contacts');

    const contacts = await new Promise<{ whatsapp: string; instagram: string; email: string }>((resolve) => {
      (window as Window & { __funnelResolveContacts?: (v: { whatsapp: string; instagram: string; email: string }) => void }).__funnelResolveContacts = resolve;
    });

    setInputMode(null);
    addUserMessage(`WhatsApp: ${contacts.whatsapp}`);
    await updateLead({ whatsapp: contacts.whatsapp, instagram: contacts.instagram, email: contacts.email });

    // ── BLOCO 12A — Agendamento ────────────────────────────────────────────
    await showBotMessages([
      `Tudo certo, ${nome}.`,
      'Agora escolha o melhor horário para sua reunião comigo.',
      'Nessa conversa, eu vou entender seu momento atual e montar um plano para você avançar rumo à sua meta com uma agência de IA.',
    ]);
    setInputMode('calendly_btn');
    isRunning.current = false;
  }, [showBotMessages, addUserMessage, createLead, updateLead, runBranchMessages]);

  useEffect(() => {
    runFunnel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || inputDisabled) return;
    const value = textInput.trim();
    setTextInput('');
    setInputMode(null);
    const w = window as Window & { __funnelResolveNome?: (v: string) => void };
    if (w.__funnelResolveNome) {
      const resolve = w.__funnelResolveNome;
      delete w.__funnelResolveNome;
      resolve(value);
    }
  };

  const handleChoice = useCallback((option: string) => {
    if (inputDisabled) return;
    setInputMode(null);
    const w = window as Window & { __funnelResolveChoice?: (v: string) => void };
    if (w.__funnelResolveChoice) {
      const resolve = w.__funnelResolveChoice;
      delete w.__funnelResolveChoice;
      resolve(option);
    }
  }, [inputDisabled]);

  const handleContactsSubmit = useCallback((data: { whatsapp: string; instagram: string; email: string }) => {
    setInputMode(null);
    const w = window as Window & { __funnelResolveContacts?: (v: typeof data) => void };
    if (w.__funnelResolveContacts) {
      const resolve = w.__funnelResolveContacts;
      delete w.__funnelResolveContacts;
      resolve(data);
    }
  }, []);

  const handleCalendlyClick = useCallback(async () => {
    await updateLead({ clicou_agendamento: true });
    if (QUALIFIED_INVESTMENTS.includes(leadData.current.investimento)) {
      trackLead();
    }
    setShowCalendly(true);
  }, [updateLead]);

  const handleCalendlyScheduled = useCallback(async () => {
    await updateLead({ agendou_reuniao: true });
    setShowCalendly(false);
    setInputMode(null);
    await showBotMessages([
      'Reunião agendada. ✓',
      'No horário escolhido, esteja em um local tranquilo para conversar comigo.',
      'Eu vou analisar seu cenário e te mostrar um plano para construir ou escalar sua agência de IA com base na metodologia que a Revolução AI usa em projetos reais.',
    ]);
  }, [updateLead, showBotMessages]);

  const handleCalendlyClose = useCallback(async () => {
    setShowCalendly(false);
    setInputMode(null);
    await showBotMessages([
      'Reunião agendada. ✓',
      'No horário escolhido, esteja em um local tranquilo para conversar comigo.',
      'Eu vou analisar seu cenário e te mostrar um plano para construir ou escalar sua agência de IA com base na metodologia que a Revolução AI usa em projetos reais.',
    ]);
  }, [showBotMessages]);

  const cursoUrl = process.env.NEXT_PUBLIC_CURSO_197_URL;

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d]">
      <ChatHeader />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto w-full max-w-lg mx-auto px-3 py-5">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} />
        ))}

        {showTyping && <TypingIndicator />}

        {/* Choice buttons */}
        {!showTyping && inputMode === 'choice' && (
          <ChoiceButtons options={choiceOptions} onSelect={handleChoice} disabled={inputDisabled} />
        )}

        {/* Contact form */}
        {!showTyping && inputMode === 'contacts' && (
          <ContactForm onSubmit={handleContactsSubmit} disabled={inputDisabled} />
        )}

        {/* Calendly button */}
        {!showTyping && inputMode === 'calendly_btn' && (
          <div className="pl-9 mb-4">
            <button
              onClick={handleCalendlyClick}
              className="
                bg-[#25D366] text-white font-semibold rounded-xl px-6 py-3 text-sm
                hover:bg-[#20bf5a] hover:shadow-lg hover:shadow-[#25D36633]
                active:scale-[0.98] transition-all duration-150
              "
            >
              Agendar reunião com Lucas
            </button>
          </div>
        )}

        {/* Curso button */}
        {!showTyping && inputMode === 'curso_btn' && (
          <div className="pl-9 mb-4">
            <button
              onClick={() => {
                if (cursoUrl) {
                  window.location.href = cursoUrl;
                } else {
                  alert('Link do treinamento ainda não configurado.');
                }
              }}
              className="
                bg-[#25D366] text-white font-semibold rounded-xl px-6 py-3 text-sm
                hover:bg-[#20bf5a] hover:shadow-lg hover:shadow-[#25D36633]
                active:scale-[0.98] transition-all duration-150
              "
            >
              Conhecer o treinamento de entrada
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text input bar */}
      {inputMode === 'text' && (
        <div className="w-full max-w-lg mx-auto px-3 pb-4 pt-2">
          <form
            onSubmit={handleTextSubmit}
            className="flex gap-2 bg-[#1a1a1a] rounded-2xl border border-[#2d2d2d] p-2 shadow-lg"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Seu nome..."
              autoFocus
              disabled={inputDisabled}
              className="flex-1 bg-transparent text-white placeholder-[#555] px-2 py-1.5 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={inputDisabled || !textInput.trim()}
              className="
                bg-[#25D366] text-white rounded-xl px-4 py-2 text-sm font-semibold
                hover:bg-[#20bf5a] transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0
              "
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      {showCalendly && (
        <CalendlyModal
          onClose={handleCalendlyClose}
          onScheduled={handleCalendlyScheduled}
        />
      )}
    </div>
  );
}
