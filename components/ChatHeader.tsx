'use client';

export default function ChatHeader() {
  return (
    <div style={{
      backgroundColor: '#111111',
      borderBottom: '1px solid #222',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden',
          border: '2px solid #25D366', boxShadow: '0 0 10px rgba(37,211,102,0.3)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatar.jpg"
            alt="Lucas Magalhães"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.style.backgroundColor = '#2a2a2a';
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div style={{
          position: 'absolute', bottom: '1px', right: '1px',
          width: '11px', height: '11px', backgroundColor: '#25D366',
          borderRadius: '50%', border: '2px solid #111111',
        }} />
      </div>
      <div>
        <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px', lineHeight: 1.2 }}>
          @lucasmag.ai
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
          <div style={{ width: '6px', height: '6px', backgroundColor: '#25D366', borderRadius: '50%' }} />
          <span style={{ color: '#25D366', fontSize: '11px', fontWeight: 500 }}>Online</span>
        </div>
      </div>
    </div>
  );
}
