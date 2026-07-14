type Props = {
  items: string[];
  placeholder: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export const FilterComboBox = ({
  items,
  placeholder,
  value,
  onValueChange,
}: Props) => {
  return (
    <select
      aria-label={placeholder}
      className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      value={value ?? ""}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {items.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};
