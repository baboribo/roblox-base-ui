"use client";
import { useState, useId } from "react";
import { Combobox } from "../src/components/ui/combobox";
const items = ["Adventure", "Racing", "Sports"];
export function ComboboxMultipleExample() {
  const inputId = useId();
  const [value, setValue] = useState<string[]>(["Racing"]);
  return (
    <Combobox.Root
      items={items}
      multiple
      value={value}
      onValueChange={setValue}
    >
      <label htmlFor={inputId}>장르 선택</label>
      <Combobox.Chips>
        {value.map((item) => (
          <Combobox.Chip key={item}>
            {item}
            <Combobox.ChipRemove aria-label={`${item} 삭제`}>
              ×
            </Combobox.ChipRemove>
          </Combobox.Chip>
        ))}
        <Combobox.Input id={inputId} placeholder="장르 검색" />
      </Combobox.Chips>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={8}>
          <Combobox.Popup>
            <Combobox.Empty>검색 결과 없음</Combobox.Empty>
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item}>
                  <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
                  {item}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
