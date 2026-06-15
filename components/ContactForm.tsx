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
    const digits = whatsapp.replace(/\D/g, '');
    if (!digits) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (digits.length < 10 || digits.length > 11) {
      newErrors.whatsapp = 'DDD + número (10 ou 11 dígitos)';
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
    const ig = instagram.trim();
    onSubmit({
      whatsapp: whatsapp.replace(/\D/g, ''),
      instagram: ig ? (ig.startsWith('@') ? ig : `@${ig}`) : '',
      email: email.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="pl-9 pr-1 mb-4">
      <div className="bg-[#1e2124] rounded-2xl p-4 flex flex-col gap-3 border border-[#2d2d2d]">
        <div>
          <input
            type="tel"
            placeholder="WhatsApp (ex: 11999999999)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            disabled={disabled}
            className="w-full bg-[#141618] text-white placeholder-[#555] rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#25D366] border border-[#2d2d2d] transition-all disabled:opacity-50"
          />
          {errors.whatsapp && <p className="text-red-400 text-xs mt-1.5 pl-1">{errors.whatsapp}</p>}
        </div>
        <input
          type="text"
          placeholder="Instagram (ex: @usuario)"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          disabled={disabled}
          className="w-full bg-[#141618] text-white placeholder-[#555] rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#25D366] border border-[#2d2d2d] transition-all disabled:opacity-50"
        />
        <div>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            className="w-full bg-[#141618] text-white placeholder-[#555] rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#25D366] border border-[#2d2d2d] transition-all disabled:opacity-50"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1.5 pl-1">{errors.email}</p>}
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="
            bg-[#25D366] text-white font-semibold rounded-xl px-4 py-3 text-sm
            hover:bg-[#20bf5a] hover:shadow-lg hover:shadow-[#25D36633]
            active:scale-[0.98] transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          Liberar agenda
        </button>
      </div>
    </form>
  );
}
