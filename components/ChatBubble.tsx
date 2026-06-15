interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
}

export default function ChatBubble({ message, isUser = false }: ChatBubbleProps) {
  if (isUser) {
    return (
      <div className="flex justify-end mb-2 px-1">
        <div
          className="bg-[#25D366] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[78%] text-sm leading-relaxed shadow-sm"
          style={{ wordBreak: 'break-word' }}
        >
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-2 px-1">
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mb-0.5 border border-[#333]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.jpg"
          alt=""
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).parentElement!.style.background = '#2a2a2a';
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div
        className="bg-[#1e2124] text-[#e8e8e8] rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[78%] text-sm leading-relaxed shadow-sm whitespace-pre-wrap"
        style={{ wordBreak: 'break-word' }}
      >
        {message}
      </div>
    </div>
  );
}
