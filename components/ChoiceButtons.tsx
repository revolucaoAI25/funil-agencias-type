interface ChoiceButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export default function ChoiceButtons({ options, onSelect, disabled }: ChoiceButtonsProps) {
  return (
    <div className="flex flex-col gap-2 mt-2 mb-4 pl-10">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="bg-transparent border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors rounded-xl px-4 py-2.5 text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
