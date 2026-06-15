export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '8px', padding: '0 4px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden',
        flexShrink: 0, marginBottom: '2px', border: '1px solid #333', backgroundColor: '#2a2a2a',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div style={{
        backgroundColor: '#1e2124',
        borderRadius: '18px',
        borderTopLeftRadius: '4px',
        padding: '12px 16px',
        display: 'flex',
        gap: '5px',
        alignItems: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}>
        <div className="typing-dot" style={{ width: '7px', height: '7px', backgroundColor: '#888', borderRadius: '50%' }} />
        <div className="typing-dot" style={{ width: '7px', height: '7px', backgroundColor: '#888', borderRadius: '50%' }} />
        <div className="typing-dot" style={{ width: '7px', height: '7px', backgroundColor: '#888', borderRadius: '50%' }} />
      </div>
    </div>
  );
}
