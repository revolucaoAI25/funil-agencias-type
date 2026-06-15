interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
  showAvatar?: boolean;
}

export default function ChatBubble({ message, isUser = false, showAvatar = false }: ChatBubbleProps) {
  const profileImage = process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL;

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="bg-[#25D366] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-sm leading-relaxed">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
        {profileImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profileImage} alt="Avatar" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="bg-[#1e1e1e] text-white rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap">
        {message}
      </div>
    </div>
  );
}
