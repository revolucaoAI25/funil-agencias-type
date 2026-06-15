export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0" />
      <div className="bg-[#1e1e1e] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
      </div>
    </div>
  );
}
