'use client';

import { useState } from 'react';

interface ChoiceButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

function ChoiceButton({ label, onSelect, disabled }: { label: string; onSelect: () => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#25D366' : 'transparent',
        color: hovered ? '#ffffff' : '#25D366',
        border: '1.5px solid #25D366',
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '13px',
        fontWeight: 500,
        textAlign: 'left',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
        width: '100%',
        boxShadow: hovered ? '0 4px 12px rgba(37,211,102,0.2)' : 'none',
      }}
    >
      {label}
    </button>
  );
}

export default function ChoiceButtons({ options, onSelect, disabled }: ChoiceButtonsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px', marginBottom: '16px', paddingLeft: '36px', paddingRight: '4px' }}>
      {options.map((option) => (
        <ChoiceButton key={option} label={option} onSelect={() => onSelect(option)} disabled={disabled} />
      ))}
    </div>
  );
}
