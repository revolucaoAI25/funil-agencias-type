export default function ChatHeader() {
  const profileImage = process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL;

  return (
    <div className="bg-[#111111] border-b border-[#2a2a2a] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
          {profileImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profileImage} alt="Lucas Magalhães" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#111111]" />
      </div>
      <div>
        <div className="text-white font-semibold text-sm">@lucasmag.ai</div>
        <div className="text-[#25D366] text-xs">Online</div>
      </div>
    </div>
  );
}
