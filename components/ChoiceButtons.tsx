interface ChoiceButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export default function ChoiceButtons({ options, onSelect, disabled }: ChoiceButtonsProps) {
  return (
    <div className="flex flex-col gap-2 mt-2 mb-4 pl-9 pr-1">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="
            border border-[#25D366] text-[#25D366] bg-transparent
            hover:bg-[#25D366] hover:text-white hover:shadow-lg hover:shadow-[#25D36622]
            active:scale-[0.98]
            transition-all duration-150
            rounded-xl px-4 py-2.5 text-sm font-medium text-left
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {option}
        </button>
      ))}
    </div>
  );
}
