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

type FunnelStep =
  | 'abertura_msgs'
  | 'waiting_nome'
  | 'autoridade_msgs'
  | 'waiting_perfil'
  | 'branch_msgs'
  | 'step3_msg'
  | 'waiting_momento'
  | 'step4_msg'
  | 'waiting_faturamento'
  | 'step5_msgs'
  | 'step6_msg'
  | 'waiting_necessidade'
  | 'step7_msgs'
  | 'step8_msg'
  | 'waiting_objetivo'
  | 'step9_msg'
  | 'waiting_investimento'
  | 'step10a_msgs'
  | 'waiting_contacts'
  | 'step11a_msgs'
  | 'waiting_calendly'
  | 'step12a_msgs'
  | 'step10b_msgs'
  | 'done';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<FunnelStep>('abertura_msgs');
  const [showInput, setShowInput] = useState<'text' | 'choice' | 'contacts' | 'calendly_btn' | 'curso_btn' | null>(null);
  const [choiceOptions, setChoiceOptions] = useState<string[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  
  const leadData = useRef({
    nome: '',
    perfil: '',
    momento_operacao: '',
    faturamento_atual: '',
    principal_necessidade: '',
    objetivo_faturamento: '',
    investimento: '',
    whatsapp: '',
    instagram: '',
    email: '',
    status_lead: 'novo',
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
  const stepExecuted = useRef<Set<string>>(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping, showInput]);

  const addMessage = useCallback((text: string, isUser = false) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages((prev) => [...prev, { id, text, isUser }]);
  }, []);

  // Show messages sequentially with typing indicator
  const showMessages = useCallback(async (msgs: string[], firstInstant = false) => {
    for (let i = 0; i < msgs.length; i++) {
      if (i === 0 && firstInstant) {
        addMessage(msgs[i]);
      } else {
        setShowTyping(true);
        await new Promise((r) => setTimeout(r, 1500));
        setShowTyping(false);
        addMessage(msgs[i]);
      }
      await new Promise((r) => setTimeout(r, 100));
    }
  }, [addMessage]);

  const createLead = useCallback(async () => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData.current),
      });
      const data = await res.json();
      if (data.id) setLeadId(data.id);
    } catch (e) {
      console.error('Error creating lead:', e);
    }
  }, []);

  const updateLead = useCallback(async (updates: Record<string, unknown>) => {
    Object.assign(leadData.current, updates);
    if (leadId) {
      try {
        await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      } catch (e) {
        console.error('Error updating lead:', e);
      }
    }
  }, [leadId]);

  // Capture UTMs and cookies on mount
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

  // Main funnel state machine
  const runStep = useCallback(async (step: FunnelStep) => {
    if (stepExecuted.current.has(step)) return;
    stepExecuted.current.add(step);

    const nome = leadData.current.nome;

    if (step === 'abertura_msgs') {
      await showMessages([
        'Quer faturar R$50 mil por mês com uma agência de IA em até 6 meses?',
        'Responda algumas perguntas rápidas e veja se faz sentido agendar uma reunião comigo, Lucas Magalhães, fundador da Revolução AI.',
        'Na call, eu vou analisar seu cenário e te mostrar um plano para vender e entregar agentes de IA high ticket para empresas usando a metodologia de uma das primeiras agências de IA do Brasil.',
        'Antes de começar, qual é seu nome?',
      ], true);
      setShowInput('text');
      setCurrentStep('waiting_nome');
    }

    else if (step === 'autoridade_msgs') {
      await showMessages([
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
      setShowInput('choice');
      setCurrentStep('waiting_perfil');
    }

    else if (step === 'branch_msgs') {
      const perfil = leadData.current.perfil;
      let msgs: string[] = [];
      
      if (perfil === 'Já sei implementar IA, mas preciso vender mais') {
        msgs = [
          `Boa, ${nome}.`,
          'Nesse caso, o principal ponto é transformar sua capacidade técnica em uma oferta vendável, com aquisição, posicionamento, qualificação, reunião comercial, proposta e fechamento high ticket.',
          'Na Revolução AI, eu estruturei esse processo dentro da própria agência para vender agentes de IA para empresas com previsibilidade e percepção de valor alta.',
        ];
      } else if (perfil === 'Já sei vender, mas preciso aprender a entregar IA') {
        msgs = [
          `Boa, ${nome}.`,
          'Nesse caso, o principal ponto é ter uma entrega validada para colocar no mercado com segurança.',
          'A Revolução AI já realizou mais de 100 implementações reais e desenvolveu uma metodologia para construir agentes de IA com padrão, velocidade e qualidade.',
          'Na reunião, eu vou entender seu cenário e mostrar como essa entrega pode virar uma oferta high ticket para empresas.',
        ];
      } else if (perfil === 'Quero aprender venda e entrega do zero') {
        msgs = [
          `Perfeito, ${nome}.`,
          'Nesse caso, o caminho precisa ser completo.',
          'Você precisa entender qual oferta vender, como gerar oportunidades, como conduzir vendas, como construir os agentes e como organizar a entrega.',
          'É exatamente esse processo que a Revolução AI estruturou: oferta, aquisição, vendas, entrega e operação.',
        ];
      } else if (perfil === 'Já tenho operação de IA e quero escalar') {
        msgs = [
          `Boa, ${nome}.`,
          'Nesse caso, a reunião precisa olhar para os gargalos de escala.',
          'Pode ser aquisição, conversão, ticket, entrega, operação ou padronização.',
          'A Revolução AI cresceu porque transformou a entrega de agentes de IA em uma metodologia comercial e operacional replicável, aplicada em mais de 100 operações reais.',
        ];
      } else if (perfil === 'Tenho agência de marketing/tráfego e quero entrar em IA') {
        msgs = [
          `Boa, ${nome}.`,
          'Esse é um dos caminhos mais fortes.',
          'Quem já entende de tráfego, geração de leads e venda de serviços pode usar agentes de IA como uma nova oferta high ticket para empresas que já recebem oportunidades, mas precisam converter mais.',
          'Na reunião, eu vou te mostrar como essa solução pode entrar na sua operação com uma metodologia validada de venda e entrega.',
        ];
      }
      
      await showMessages(msgs);
      stepExecuted.current.delete('step3_msg');
      setCurrentStep('step3_msg');
    }

    else if (step === 'step3_msg') {
      await showMessages(['Como está sua operação hoje?']);
      setChoiceOptions([
        'Ainda estou começando',
        'Já estudo IA ou serviços digitais, mas ainda vendo pouco',
        'Já vendi alguns projetos',
        'Já tenho clientes ativos',
        'Já tenho operação rodando e quero escalar',
      ]);
      setShowInput('choice');
      setCurrentStep('waiting_momento');
    }

    else if (step === 'step4_msg') {
      await showMessages(['Quanto você fatura hoje por mês com IA, automação, tráfego ou serviços digitais?']);
      setChoiceOptions([
        'Ainda não faturo',
        'Até R$10 mil/mês',
        'De R$10 mil a R$30 mil/mês',
        'De R$30 mil a R$50 mil/mês',
        'Acima de R$50 mil/mês',
      ]);
      setShowInput('choice');
      setCurrentStep('waiting_faturamento');
    }

    else if (step === 'step5_msgs') {
      await showMessages([
        'Entendido.',
        'A metodologia da Revolução AI já foi aplicada em mais de 100 operações reais, passando por empresas, franquias, softwares, escritórios, clínicas, restaurantes, infoprodutores e influenciadores com grandes audiências.',
        'Alguns clientes e operações que já passaram pela Revolução AI:\n\nBubble Box — franqueadora com mais de 250 unidades no Brasil. Casoca — plataforma para arquitetos e designers com mais de 300 mil profissionais cadastrados. Patrícia Davidson — nutricionista influencer com mais de 3 milhões de seguidores. Dra. Ryuza Gonçalves — influencer de suplementação com mais de 700 mil seguidores. Tami Gerhardt — influenciadora de emagrecimento com mais de 450 mil seguidores. Willian Celso / Autêntica — referência em posicionamento de marca, com mais de 400 mil seguidores. Marcondes Madureira Advogados — escritório de Direito de Família com forte presença digital e mais de 380 mil seguidores. Guilherme Vazan — infoprodutor de impressão 3D com mais de 5 mil alunos. Guedes & Cruz Advogados — escritório de advocacia bancária com alto volume de leads. Kanpai BH — restaurante japonês premium em Belo Horizonte.',
        'Agora precisamos entender o principal ponto que está impedindo você de avançar mais rápido.',
      ]);
      stepExecuted.current.delete('step6_msg');
      setCurrentStep('step6_msg');
    }

    else if (step === 'step6_msg') {
      await showMessages(['Hoje, o que você mais precisa para crescer com IA?']);
      setChoiceOptions([
        'Aprender a construir agentes de IA',
        'Aprender a vender IA high ticket',
        'Ter uma oferta mais clara e vendável',
        'Gerar mais leads qualificados',
        'Vender com mais consistência',
        'Escalar minha operação atual',
      ]);
      setShowInput('choice');
      setCurrentStep('waiting_necessidade');
    }

    else if (step === 'step7_msgs') {
      await showMessages([
        'Esse é exatamente o tipo de ponto que eu analiso na reunião.',
        'Na Revolução AI, o crescimento veio de uma metodologia baseada em aquisição, venda e entrega.',
        'Esse método já foi aplicado em projetos reais para aumentar conversas, reuniões e agendamentos mantendo o mesmo investimento em tráfego.',
        'Alguns exemplos:\n\nPita Advocacia: de 10 para cerca de 50 reuniões/mês. Bubble Box: de 40 para 180 reuniões/mês. Dr. Paulo Bernardo: de 5 para 30 consultas/mês.',
        'Agora vamos entender sua meta.',
      ]);
      stepExecuted.current.delete('step8_msg');
      setCurrentStep('step8_msg');
    }

    else if (step === 'step8_msg') {
      await showMessages(['Qual faturamento mensal você quer atingir com sua agência de IA nos próximos 6 meses?']);
      setChoiceOptions([
        'Fazer as primeiras vendas',
        'R$10 mil/mês',
        'R$30 mil/mês',
        'R$50 mil/mês',
        'Acima de R$50 mil/mês',
      ]);
      setShowInput('choice');
      setCurrentStep('waiting_objetivo');
    }

    else if (step === 'step9_msg') {
      await showMessages(['Para acelerar esse plano, quanto você estaria disposto a investir em uma mentoria com acompanhamento direto, método comercial, método de entrega, scripts, templates e direcionamento?']);
      setChoiceOptions([
        'Até R$3 mil',
        'De R$3 mil a R$6 mil',
        'De R$6 mil a R$10 mil',
        'Acima de R$10 mil',
        'Não consigo investir agora',
      ]);
      setShowInput('choice');
      setCurrentStep('waiting_investimento');
    }

    else if (step === 'step10a_msgs') {
      await showMessages([
        `Perfeito, ${nome}.`,
        'Pelo que você respondeu, faz sentido você avançar para uma reunião comigo.',
        'Na call, eu vou analisar seu cenário e montar um plano para você estruturar sua agência de IA com base nos 5 pilares da metodologia da Revolução AI:',
        'oferta, aquisição, vendas, entrega e operação.',
        'A ideia é você sair da reunião com clareza sobre o caminho mais direto para vender e entregar agentes de IA high ticket para empresas.',
        'Antes de liberar a agenda, deixe seu contato para nossa equipe confirmar sua aplicação.',
      ]);
      setShowInput('contacts');
      setCurrentStep('waiting_contacts');
    }

    else if (step === 'step11a_msgs') {
      await showMessages([
        `Tudo certo, ${nome}.`,
        'Agora escolha o melhor horário para sua reunião comigo.',
        'Nessa conversa, eu vou entender seu momento atual e montar um plano para você avançar rumo à sua meta com uma agência de IA.',
      ]);
      setShowInput('calendly_btn');
      setCurrentStep('waiting_calendly');
    }

    else if (step === 'step12a_msgs') {
      await showMessages([
        'Reunião agendada. ✓',
        'No horário escolhido, esteja em um local tranquilo para conversar comigo.',
        'Eu vou analisar seu cenário e te mostrar um plano para construir ou escalar sua agência de IA com base na metodologia que a Revolução AI usa em projetos reais.',
      ]);
      setShowInput(null);
      setCurrentStep('done');
    }

    else if (step === 'step10b_msgs') {
      await showMessages([
        `Entendi, ${nome}.`,
        'Neste momento, o melhor próximo passo para você é começar por um treinamento mais simples e direto.',
        'Vou te enviar uma opção de entrada para você começar a entender como funciona o mercado de agentes de IA e dar os primeiros passos.',
      ]);
      setShowInput('curso_btn');
      setCurrentStep('done');
    }
  }, [showMessages, leadId]);

  // Step transitions
  useEffect(() => {
    const autoSteps: FunnelStep[] = ['step5_msgs', 'step7_msgs', 'branch_msgs', 'step3_msg', 'step6_msg', 'step8_msg'];
    if (autoSteps.includes(currentStep) && !stepExecuted.current.has(currentStep)) {
      runStep(currentStep);
    }
  }, [currentStep, runStep]);

  // Initial step
  useEffect(() => {
    runStep('abertura_msgs');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || inputDisabled) return;
    
    const value = textInput.trim();
    setInputDisabled(true);
    setShowInput(null);
    addMessage(value, true);
    setTextInput('');

    if (currentStep === 'waiting_nome') {
      leadData.current.nome = value;
      await createLead();
      await updateLead({ nome: value });
      stepExecuted.current.delete('autoridade_msgs');
      setCurrentStep('autoridade_msgs');
    }
    
    setInputDisabled(false);
  }, [textInput, inputDisabled, currentStep, addMessage, createLead, updateLead]);

  const handleChoice = useCallback(async (option: string) => {
    if (inputDisabled) return;
    setInputDisabled(true);
    setShowInput(null);
    addMessage(option, true);

    if (currentStep === 'waiting_perfil') {
      await updateLead({ perfil: option });
      leadData.current.perfil = option;
      stepExecuted.current.delete('branch_msgs');
      setCurrentStep('branch_msgs');
    } else if (currentStep === 'waiting_momento') {
      await updateLead({ momento_operacao: option });
      stepExecuted.current.delete('step4_msg');
      setCurrentStep('step4_msg');
    } else if (currentStep === 'waiting_faturamento') {
      await updateLead({ faturamento_atual: option });
      stepExecuted.current.delete('step5_msgs');
      setCurrentStep('step5_msgs');
    } else if (currentStep === 'waiting_necessidade') {
      await updateLead({ principal_necessidade: option });
      stepExecuted.current.delete('step7_msgs');
      setCurrentStep('step7_msgs');
    } else if (currentStep === 'waiting_objetivo') {
      await updateLead({ objetivo_faturamento: option });
      stepExecuted.current.delete('step9_msg');
      setCurrentStep('step9_msg');
    } else if (currentStep === 'waiting_investimento') {
      let status = 'novo';
      if (['De R$3 mil a R$6 mil', 'De R$6 mil a R$10 mil', 'Acima de R$10 mil'].includes(option)) {
        status = 'qualificado';
      } else if (option === 'Até R$3 mil') {
        status = 'baixo_investimento';
      } else if (option === 'Não consigo investir agora') {
        status = 'curso_197';
      }
      await updateLead({ investimento: option, status_lead: status });
      leadData.current.investimento = option;
      leadData.current.status_lead = status;
      
      if (status === 'curso_197') {
        stepExecuted.current.delete('step10b_msgs');
        setCurrentStep('step10b_msgs');
      } else {
        stepExecuted.current.delete('step10a_msgs');
        setCurrentStep('step10a_msgs');
      }
    }
    
    setInputDisabled(false);
  }, [inputDisabled, currentStep, addMessage, updateLead]);

  const handleContactsSubmit = useCallback(async (data: { whatsapp: string; instagram: string; email: string }) => {
    setInputDisabled(true);
    setShowInput(null);
    addMessage(`WhatsApp: ${data.whatsapp}`, true);
    await updateLead({ whatsapp: data.whatsapp, instagram: data.instagram, email: data.email });
    stepExecuted.current.delete('step11a_msgs');
    setCurrentStep('step11a_msgs');
    setInputDisabled(false);
  }, [addMessage, updateLead]);

  const handleCalendlyClick = useCallback(async () => {
    await updateLead({ clicou_agendamento: true });
    const qualifiedInvestments = ['De R$3 mil a R$6 mil', 'De R$6 mil a R$10 mil', 'Acima de R$10 mil'];
    if (qualifiedInvestments.includes(leadData.current.investimento)) {
      trackLead();
    }
    setShowCalendly(true);
  }, [updateLead]);

  const handleCalendlyScheduled = useCallback(async () => {
    await updateLead({ agendou_reuniao: true });
    setShowCalendly(false);
    setShowInput(null);
    stepExecuted.current.delete('step12a_msgs');
    setCurrentStep('step12a_msgs');
  }, [updateLead]);

  const handleCalendlyClose = useCallback(() => {
    setShowCalendly(false);
    // Show confirmation after close even if we don't know if scheduled
    stepExecuted.current.delete('step12a_msgs');
    setCurrentStep('step12a_msgs');
    setShowInput(null);
  }, []);

  const cursoUrl = process.env.NEXT_PUBLIC_CURSO_197_URL;

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} />
        ))}
        
        {showTyping && <TypingIndicator />}
        
        {!showTyping && showInput === 'choice' && (
          <ChoiceButtons options={choiceOptions} onSelect={handleChoice} disabled={inputDisabled} />
        )}

        {!showTyping && showInput === 'contacts' && (
          <ContactForm onSubmit={handleContactsSubmit} disabled={inputDisabled} />
        )}

        {!showTyping && showInput === 'calendly_btn' && (
          <div className="pl-10 mb-4">
            <button
              onClick={handleCalendlyClick}
              className="bg-[#25D366] text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-[#1fad52] transition-colors"
            >
              Agendar reunião com Lucas
            </button>
          </div>
        )}

        {!showTyping && showInput === 'curso_btn' && (
          <div className="pl-10 mb-4">
            <button
              onClick={() => {
                if (cursoUrl) {
                  window.location.href = cursoUrl;
                } else {
                  alert('Link do treinamento ainda não configurado.');
                }
              }}
              className="bg-[#25D366] text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-[#1fad52] transition-colors"
            >
              Conhecer o treinamento de entrada
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showInput === 'text' && (
        <form
          onSubmit={handleTextSubmit}
          className="bg-[#111111] border-t border-[#2a2a2a] px-4 py-3 flex gap-2 max-w-lg mx-auto w-full"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Seu nome..."
            className="flex-1 bg-[#1e1e1e] text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#25D366]"
            autoFocus
            disabled={inputDisabled}
          />
          <button
            type="submit"
            disabled={inputDisabled || !textInput.trim()}
            className="bg-[#25D366] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#1fad52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
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
