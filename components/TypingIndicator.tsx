export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '6px', paddingRight: '60px' }}>
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
