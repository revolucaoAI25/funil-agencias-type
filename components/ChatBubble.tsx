interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
}

const botBubbleStyle: React.CSSProperties = {
  backgroundColor: '#1e2124',
  color: '#e8e8e8',
  borderRadius: '18px',
  borderTopLeftRadius: '4px',
  padding: '10px 14px',
  maxWidth: '78%',
  fontSize: '14px',
  lineHeight: '1.55',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
};

const userBubbleStyle: React.CSSProperties = {
  backgroundColor: '#25D366',
  color: '#ffffff',
  borderRadius: '18px',
  borderTopRightRadius: '4px',
  padding: '10px 14px',
  maxWidth: '78%',
  fontSize: '14px',
  lineHeight: '1.55',
  wordBreak: 'break-word',
  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
};

const avatarStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  marginBottom: '2px',
  border: '1px solid #333',
  backgroundColor: '#2a2a2a',
};

export default function ChatBubble({ message, isUser = false }: ChatBubbleProps) {
  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px', padding: '0 4px' }}>
        <div style={userBubbleStyle}>{message}</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '8px', padding: '0 4px' }}>
      <div style={avatarStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.jpg"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div style={botBubbleStyle}>{message}</div>
    </div>
  );
}
