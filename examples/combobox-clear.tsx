"use client";
import { useId } from "react";
import { Combobox } from "../src/components/ui/combobox";
const items = ["Adventure", "Racing", "Sports"];
export function ComboboxClearExample() {
  const inputId = useId();
  return (
    <Combobox.Root items={items} defaultValue="Racing">
      <label htmlFor={inputId}>장르</label>
      <div style={{ display: "flex", gap: 8 }}>
        <Combobox.Input id={inputId} />
        <Combobox.Clear aria-label="선택 지우기">지우기</Combobox.Clear>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={8}>
          <Combobox.Popup>
            <Combobox.Empty>검색 결과 없음</Combobox.Empty>
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item}>
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
