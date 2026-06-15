interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
}

// Converts simple markdown-like syntax to HTML:
// **text** → bold, lines starting with • → bullet items
function renderMessage(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inList = false;

  for (const raw of lines) {
    // Apply **bold**
    const line = raw.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    if (line.startsWith('• ')) {
      if (!inList) {
        result.push('<ul style="margin:6px 0 2px 0;padding:0;list-style:none;">');
        inList = true;
      }
      result.push(
        `<li style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px;">` +
        `<span style="color:#25D366;font-size:16px;line-height:1.3;flex-shrink:0;">•</span>` +
        `<span>${line.slice(2)}</span></li>`
      );
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(line === '' ? '<br>' : `<span>${line}</span><br>`);
    }
  }
  if (inList) result.push('</ul>');

  // Clean up trailing <br>
  return result.join('').replace(/(<br>)+$/, '');
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
          maxWidth: '80%',
        }}>
          {message}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '6px', paddingRight: '60px' }}>
      <div
        style={{
          backgroundColor: '#1e2124',
          color: '#e8e8e8',
          borderRadius: '18px',
          borderTopLeftRadius: '4px',
          padding: '10px 14px',
          fontSize: '14px',
          lineHeight: '1.6',
          wordBreak: 'break-word',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          maxWidth: '80%',
        }}
        dangerouslySetInnerHTML={{ __html: renderMessage(message) }}
      />
    </div>
  );
}
