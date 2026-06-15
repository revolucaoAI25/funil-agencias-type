'use client';

import { useEffect, useRef } from 'react';

interface CalendlyModalProps {
  onClose: () => void;
  onScheduled?: () => void;
}

export default function CalendlyModal({ onClose, onScheduled }: CalendlyModalProps) {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendlyUrl) return;

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        onScheduled?.();
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
      document.head.removeChild(script);
    };
  }, [calendlyUrl, onScheduled]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <h2 className="text-white font-semibold">Agendar Reunião</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {calendlyUrl ? (
            <div
              ref={containerRef}
              className="calendly-inline-widget w-full"
              data-url={calendlyUrl}
              style={{ minWidth: '320px', height: '630px' }}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-center p-8">
              Link de agendamento ainda não configurado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
