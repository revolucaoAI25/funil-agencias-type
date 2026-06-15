'use client';

import { useState } from 'react';

interface ContactFormProps {
  onSubmit: (data: { whatsapp: string; instagram: string; email: string }) => void;
  disabled?: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#0d0d0d',
  color: '#ffffff',
  border: '1px solid #2a2a2a',
  borderRadius: '10px',
  padding: '11px 14px',
  fontSize: '13px',
  outline: 'none',
};

export default function ContactForm({ onSubmit, disabled }: ContactFormProps) {
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const digits = whatsapp.replace(/\D/g, '');
    if (!digits) newErrors.whatsapp = 'WhatsApp é obrigatório';
    else if (digits.length < 10 || digits.length > 11) newErrors.whatsapp = 'DDD + número (10 ou 11 dígitos)';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'E-mail inválido';
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
    <form onSubmit={handleSubmit} style={{ paddingRight: '60px', marginBottom: '16px' }}>
      <div style={{
        backgroundColor: '#1a1c1f',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        border: '1px solid #2a2a2a',
      }}>
        <div>
          <input
            type="tel"
            placeholder="WhatsApp (ex: 11999999999)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            disabled={disabled}
            onFocus={() => setFocusedField('whatsapp')}
            onBlur={() => setFocusedField('')}
            style={{ ...inputStyle, borderColor: focusedField === 'whatsapp' ? '#25D366' : errors.whatsapp ? '#ef4444' : '#2a2a2a' }}
          />
          {errors.whatsapp && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', paddingLeft: '4px' }}>{errors.whatsapp}</p>}
        </div>
        <input
          type="text"
          placeholder="Instagram (ex: @usuario)"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          disabled={disabled}
          onFocus={() => setFocusedField('instagram')}
          onBlur={() => setFocusedField('')}
          style={{ ...inputStyle, borderColor: focusedField === 'instagram' ? '#25D366' : '#2a2a2a' }}
        />
        <div>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            style={{ ...inputStyle, borderColor: focusedField === 'email' ? '#25D366' : errors.email ? '#ef4444' : '#2a2a2a' }}
          />
          {errors.email && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', paddingLeft: '4px' }}>{errors.email}</p>}
        </div>
        <button
          type="submit"
          disabled={disabled}
          style={{
            backgroundColor: disabled ? '#1a5c38' : '#25D366',
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            border: 'none',
            transition: 'all 0.15s ease',
          }}
        >
          Liberar agenda
        </button>
      </div>
    </form>
  );
}
