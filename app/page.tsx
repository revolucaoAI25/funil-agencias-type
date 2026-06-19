'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';
import ChoiceButtons from '@/components/ChoiceButtons';
import ContactForm from '@/components/ContactForm';
import { trackLead, trackCustom, getCookieValue } from '@/lib/pixel';

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}


const CALENDLY_URL = 'https://calendly.com/revolucao-ai/diagnostico-agencia-de-ia';

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
  const [inputDisabled] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textFocused, setTextFocused] = useState(false);

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isRunning = useRef(false);

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
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
    async (msgs: string[], firstInstant = false, extraDelayAfterLast = 0) => {
      for (let i = 0; i < msgs.length; i++) {
        setShowTyping(true);
        const typingTime = (i === 0 && firstInstant) ? 800 : 1500;
        await delay(typingTime);
        setShowTyping(false);
        addBotMessage(msgs[i]);
        await delay(80);
      }
      if (extraDelayAfterLast > 0) {
        await delay(extraDelayAfterLast);
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
          `Boa, **${nome}**.`,
          'Nesse caso, o principal ponto é **transformar sua capacidade técnica em uma oferta vendável** — com aquisição, posicionamento, qualificação, reunião comercial, proposta e fechamento high ticket.',
          'No Revolução AI, eu estruturei esse processo dentro da própria agência para **vender agentes de IA para empresas** com previsibilidade e percepção de valor alta.',
        ],
        'Já sei vender, mas preciso aprender a entregar IA': [
          `Boa, **${nome}**.`,
          'Nesse caso, o principal ponto é **ter uma entrega validada** para colocar no mercado com segurança.',
          'O Revolução AI desenvolveu uma metodologia para construir agentes de IA com padrão, velocidade e qualidade — e já aplicou isso em projetos reais nos mais variados segmentos.',
        ],
        'Quero aprender venda e entrega do zero': [
          `Perfeito, **${nome}**.`,
          'Nesse caso, o caminho precisa ser **completo**.',
          'Você precisa estruturar:\n\n• **Qual oferta vender**\n• **Como gerar oportunidades**\n• **Como conduzir vendas**\n• **Como construir os agentes**\n• **Como organizar a entrega**\n\nÉ exatamente esse processo que o Revolução AI estruturou.',
        ],
        'Já tenho operação de IA e quero escalar': [
          `Boa, **${nome}**.`,
          'Nesse caso, o foco precisa estar nos **gargalos de escala**.',
          'Pode ser:\n\n• **Aquisição** — geração de oportunidades\n• **Conversão** — taxa de fechamento\n• **Ticket** — valor por cliente\n• **Entrega** — padrão e velocidade\n• **Operação** — padronização e replicabilidade',
        ],
        'Tenho agência de marketing/tráfego e quero entrar em IA': [
          `Boa, **${nome}**.`,
          'Esse é **um dos caminhos mais fortes**.',
          'Quem já entende de tráfego, geração de leads e venda de serviços pode usar agentes de IA como uma **nova oferta high ticket** para empresas — aproveitando o que você já sabe fazer.\n\nO Revolução AI tem uma metodologia validada de **venda e entrega** para isso.',
        ],
      };
      await showBotMessages(branches[perfil] || [`Boa, **${nome}**.`]);
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

    await showBotMessages([
      '**Quer faturar R$50 mil por mês com sua agência de IA em até 6 meses?**',
      'Eu vou analisar seu cenário e te mostrar um plano para você **vender e entregar agentes de IA high ticket** para empresas usando a metodologia de uma das primeiras agências de IA do Brasil.',
      'Antes de começar, qual é seu nome?',
    ], true);
    setInputMode('text');

    const nome = await new Promise<string>((resolve) => {
      (window as Window & { __funnelResolveNome?: (v: string) => void }).__funnelResolveNome = resolve;
    });
    setInputMode(null);
    addUserMessage(nome);
    leadData.current.nome = nome;
    await createLead();

    await showBotMessages([
      `Perfeito, **${nome}**.`,
      'Talvez você já me conheça, mas eu sou o **Lucas Magalhães**, um dos fundadores do **Revolução AI**, uma das primeiras agências de IA do Brasil.',
      'Na agência, atingimos um faturamento de R$100 mil por mês — com uma equipe enxuta — e foi dentro dela que eu validei todo o método que hoje ensino.',
      'Desde 2023, a nossa agência estruturou projetos de IA aplicada a negócios em nichos como advocacia, saúde, estética, software, franquias, varejo e infoprodutos.',
      'Para que eu possa te ajudar melhor, me conta um pouco do seu momento. Qual opção mais combina com você hoje?',
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

    await runBranchMessages(nome, perfil);

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

    await showBotMessages(['Quanto você fatura hoje por mês com IA, automação, tráfego ou  outros serviços digitais?']);
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

    await showBotMessages([
      'Entendido.',
      'O Revolução AI já trabalhou com empresas, franquias, softwares, escritórios, clínicas, restaurantes, infoprodutores e influenciadores com grandes audiências.',
      'Alguns clientes que já passaram pelo Revolução AI:\n\n• **Bubble Box** — franqueadora com mais de 250 unidades no Brasil\n• **Casoca** — plataforma para arquitetos e designers com mais de 300 mil profissionais cadastrados\n• **Patrícia Davidson** — nutricionista influencer com mais de 3 milhões de seguidores\n• **Dra. Ryuza Gonçalves** — influencer de suplementação com mais de 700 mil seguidores\n• **Tami Gerhardt** — influenciadora de emagrecimento com mais de 450 mil seguidores\n• **Willian Celso / Autêntica** — referência em posicionamento de marca, com mais de 400 mil seguidores\n• **Marcondes Madureira Advogados** — escritório de Direito de Família com forte presença digital e mais de 380 mil seguidores\n• **Guilherme Vazan** — infoprodutor de impressão 3D com mais de 5 mil alunos\n• **Guedes & Cruz Advogados** — escritório de advocacia bancária com alto volume de leads\n• **Kanpai BH** — restaurante japonês premium em Belo Horizonte',
      'Agora precisamos entender o **principal ponto** que está impedindo você de avançar mais rápido.',
    ], false, 1000);

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

    await showBotMessages([
      'Bacana, isso nos ajuda a ter um direcionamento melhor de onde precisamos focar.',
      'Agora vamos entender sua meta.',
    ]);

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

    await showBotMessages([
      'Se uma solução te fizesse atingir **sua meta** dentro dos próximos 6 meses, quanto você estaria disposto a investir nela?',
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

    if (status === 'curso_197') {
      await showBotMessages([
        `Entendi, **${nome}**.`,
        'Neste momento, o melhor próximo passo para você é uma **opção mais acessível e adequada para o seu momento**.',
        'Vou te indicar o **Curso do Zero aos 10k com Agentes de IA** — onde você aprende a **desenvolver e vender seus primeiros agentes** com uma metodologia validada, do zero ao cliente pagante.',
      ]);
      setInputMode('curso_btn');
      isRunning.current = false;
      return;
    }

    await showBotMessages([
      `Perfeito, **${nome}**.`,
      'Pelo que você respondeu, faz sentido você avançar para uma **reunião de diagnóstico e estratégia** comigo. Nessa reunião vou entender seu cenário e te mostrar o caminho mais direto para atingir sua meta.',
      'Vou montar um plano personalizado com base nos **5 pilares da metodologia do Revolução AI**:\n\n• **Oferta** — o que vender e como posicionar\n• **Aquisição** — como gerar oportunidades\n• **Vendas** — como fechar contratos high ticket\n• **Entrega** — como construir e entregar os agentes\n• **Operação** — como escalar com padrão',
      'A ideia é você sair da reunião com **clareza sobre o caminho mais direto** para vender e entregar agentes de IA high ticket para empresas.',
      'Contratos que fechamos usando essa metodologia foram de **R$10 mil, R$12 mil, R$15 mil, R$20 mil e R$25 mil** — todos com empresas reais, sem precisar ser o mais barato.',
      'Antes de liberar a agenda, deixe seu contato para nossa equipe confirmar sua aplicação.',
    ]);
    setInputMode('contacts');

    const contacts = await new Promise<{ whatsapp: string; instagram: string; email: string }>((resolve) => {
      (window as Window & { __funnelResolveContacts?: (v: { whatsapp: string; instagram: string; email: string }) => void }).__funnelResolveContacts = resolve;
    });

    setInputMode(null);
    addUserMessage(`WhatsApp: ${contacts.whatsapp}`);
    await updateLead({ whatsapp: contacts.whatsapp, instagram: contacts.instagram, email: contacts.email, clicou_agendamento: true });

    await showBotMessages([
      `Tudo certo, **${nome}**. Escolha o melhor horário para sua reunião comigo na janela que acabou de abrir.`,
    ]);
    setInputMode('calendly_btn');
    isRunning.current = false;
  }, [showBotMessages, addUserMessage, createLead, updateLead, runBranchMessages]);

  useEffect(() => {
    runFunnel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
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
    setInputMode(null);
    const w = window as Window & { __funnelResolveChoice?: (v: string) => void };
    if (w.__funnelResolveChoice) {
      const resolve = w.__funnelResolveChoice;
      delete w.__funnelResolveChoice;
      resolve(option);
    }
  }, []);

  const handleContactsSubmit = useCallback((data: { whatsapp: string; instagram: string; email: string }) => {
    setInputMode(null);
    // Open Calendly immediately on form submit
    trackCustom('AbrirAgenda');
    if (window.Calendly) window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    else window.open(CALENDLY_URL, '_blank');
    const w = window as Window & { __funnelResolveContacts?: (v: typeof data) => void };
    if (w.__funnelResolveContacts) {
      const resolve = w.__funnelResolveContacts;
      delete w.__funnelResolveContacts;
      resolve(data);
    }
  }, []);

  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      // Calendly may send data as object or JSON string
      let data = e.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch { return; }
      }
      if (!data || !data.event) return;

      if (data.event === 'calendly.event_scheduled') {
        if (QUALIFIED_INVESTMENTS.includes(leadData.current.investimento)) {
          trackLead();
        }
        updateLead({ agendou_reuniao: true });
        setInputMode(null);
        showBotMessages([
          'Reunião agendada. ✓',
          'No horário escolhido, esteja em um local tranquilo para conversar comigo.',
          'Eu vou analisar seu cenário e te mostrar um plano para construir ou escalar sua agência de IA com base na metodologia que o Revolução AI usa em projetos reais.',
        ]);
      }

      if (data.event === 'calendly.date_and_time_selected') {
        trackCustom('CalendlyHorarioSelecionado');
      }
    };
    window.addEventListener('message', handleCalendlyEvent);
    return () => window.removeEventListener('message', handleCalendlyEvent);
  }, [updateLead, showBotMessages]);

  const handleCalendlyClick = useCallback(() => {
    trackCustom('AbrirAgenda');
    if (window.Calendly) window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    else window.open(CALENDLY_URL, '_blank');
  }, []);

  const cursoUrl = process.env.NEXT_PUBLIC_CURSO_197_URL;

  const greenBtnStyle: React.CSSProperties = {
    backgroundColor: '#25D366',
    color: '#ffffff',
    fontWeight: 600,
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 14px rgba(37,211,102,0.25)',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#0d0d0d' }}>
      <ChatHeader />

      {/* Messages */}
      <div ref={messagesContainerRef} className="chat-scroll" style={{ flex: 1, overflowY: 'auto', width: '100%', padding: '16px 20px' }}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} />
        ))}

        {showTyping && <TypingIndicator />}

        {!showTyping && inputMode === 'choice' && (
          <ChoiceButtons options={choiceOptions} onSelect={handleChoice} disabled={inputDisabled} />
        )}

        {!showTyping && inputMode === 'contacts' && (
          <ContactForm onSubmit={handleContactsSubmit} disabled={inputDisabled} />
        )}

        {!showTyping && inputMode === 'calendly_btn' && (
          <div style={{ marginBottom: '16px' }}>
            <button onClick={handleCalendlyClick} style={greenBtnStyle}>
              Agendar reunião com Lucas
            </button>
          </div>
        )}

        {!showTyping && inputMode === 'curso_btn' && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => {
                if (cursoUrl) window.location.href = cursoUrl;
                else alert('Link do treinamento ainda não configurado.');
              }}
              style={greenBtnStyle}
            >
              Conhecer o Curso do Zero aos 10k com Agentes de IA
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text input bar */}
      {inputMode === 'text' && (
        <div style={{ width: '100%', padding: '8px 20px 16px' }}>
          <form
            onSubmit={handleTextSubmit}
            style={{
              display: 'flex',
              gap: '8px',
              backgroundColor: '#1a1c1f',
              borderRadius: '16px',
              border: `1.5px solid ${textFocused ? '#25D366' : '#2a2a2a'}`,
              padding: '6px 6px 6px 14px',
              transition: 'border-color 0.2s ease',
            }}
          >
            <input
              type="text"
              inputMode="text"
              autoComplete="given-name"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onFocus={() => { setTextFocused(true); setTimeout(scrollToBottom, 300); }}
              onBlur={() => setTextFocused(false)}
              placeholder="Seu nome..."
              autoFocus
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                border: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              style={{
                backgroundColor: textInput.trim() ? '#25D366' : '#1a5c38',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: textInput.trim() ? 'pointer' : 'not-allowed',
                border: 'none',
                flexShrink: 0,
                transition: 'background-color 0.15s ease',
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
