'use client';

import { useState } from 'react';

interface ContactFormProps {
  onSubmit: (data: { whatsapp: string; instagram: string; email: string }) => void;
  disabled?: boolean;
}

export default function ContactForm({ onSubmit, disabled }: ContactFormProps) {
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!whatsapp.trim()) newErrors.whatsapp = 'WhatsApp é obrigatório';
    else if (!/^\d{10,11}$/.test(whatsapp.replace(/\D/g, ''))) {
      newErrors.whatsapp = 'Informe um número válido (10 ou 11 dígitos)';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      whatsapp: whatsapp.replace(/\D/g, ''),
      instagram: instagram.startsWith('@') ? instagram : instagram ? `@${instagram}` : '',
      email,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="pl-10 pr-2 mb-4">
      <div className="bg-[#1e1e1e] rounded-2xl p-4 flex flex-col gap-3">
        <div>
          <input
            type="tel"
            placeholder="WhatsApp (ex: 11999999999)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            disabled={disabled}
            className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#25D366] disabled:opacity-50"
          />
          {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
        </div>
        <input
          type="text"
          placeholder="Instagram (ex: @usuario)"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          disabled={disabled}
          className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#25D366] disabled:opacity-50"
        />
        <div>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            className="w-full bg-[#2a2a2a] text-white placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#25D366] disabled:opacity-50"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="bg-[#25D366] text-white font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-[#1fad52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Liberar agenda
        </button>
      </div>
    </form>
  );
}
