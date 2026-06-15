export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-2 px-1">
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mb-0.5 border border-[#333] bg-[#2a2a2a]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.jpg"
          alt=""
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="bg-[#1e2124] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm">
        <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
        <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
        <div className="w-2 h-2 bg-[#888] rounded-full typing-dot" />
      </div>
    </div>
  );
}
