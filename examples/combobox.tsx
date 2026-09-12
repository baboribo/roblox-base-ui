"use client";
import { useId } from "react";

import { Check } from "lucide-react";

import { Combobox } from "../src/components/ui/combobox";

const genres = [
  "Adventure",
  "Creative",
  "Racing",
  "Roleplay",
  "Simulation",
  "Sports",
];

export function ComboboxExample() {
  const inputId = useId();
  return (
    <Combobox.Root items={genres}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label htmlFor={inputId}>장르 검색</label>
        <Combobox.Input id={inputId} placeholder="검색하거나 선택하세요" />
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={8}>
          <Combobox.Popup>
            <Combobox.Empty>일치하는 장르가 없습니다.</Combobox.Empty>
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item}>
                  <Combobox.ItemIndicator>
                    <Check size={14} />
                  </Combobox.ItemIndicator>
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
