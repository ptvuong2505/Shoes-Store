import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/shared/ui/combobox";

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
    <Combobox
      items={items}
      value={value}
      onValueChange={(val) => onValueChange?.(val as string)}
    >
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
