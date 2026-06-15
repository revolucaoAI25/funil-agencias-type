'use client';

export default function ChatHeader() {
  return (
    <div className="bg-[#1a1a1a] border-b border-[#2d2d2d] px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-lg">
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#25D366] shadow-md shadow-[#25D36633]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatar.jpg"
            alt="Lucas Magalhães"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#1a1a1a]" />
      </div>
      <div className="flex-1">
        <div className="text-white font-semibold text-sm leading-tight">@lucasmag.ai</div>
        <div className="flex items-center gap-1 mt-0.5">
          <div className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />
          <span className="text-[#25D366] text-xs font-medium">Online</span>
        </div>
      </div>
    </div>
  );
}
