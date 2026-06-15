interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
}

export default function ChatBubble({ message, isUser = false }: ChatBubbleProps) {
  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px', paddingLeft: '60px' }}>
        <div style={{
          backgroundColor: '#25D366',
          color: '#ffffff',
          borderRadius: '18px',
          borderTopRightRadius: '4px',
          padding: '10px 14px',
          fontSize: '14px',
          lineHeight: '1.55',
          wordBreak: 'break-word',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          maxWidth: '72%',
        }}>
          {message}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '6px', paddingRight: '60px' }}>
      <div style={{
        backgroundColor: '#1e2124',
        color: '#e8e8e8',
        borderRadius: '18px',
        borderTopLeftRadius: '4px',
        padding: '10px 14px',
        fontSize: '14px',
        lineHeight: '1.55',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        maxWidth: '72%',
      }}>
        {message}
      </div>
    </div>
  );
}
