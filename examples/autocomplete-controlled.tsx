"use client";
import { useState } from "react";
import { Autocomplete } from "../src/components/ui/autocomplete";
const items = ["Adventure", "Racing", "Sports"];
export function AutocompleteControlledExample() {
  const [value, setValue] = useState("");
  return (
    <div>
      <Autocomplete.Root items={items} value={value} onValueChange={setValue}>
        <Autocomplete.Input aria-label="장르 자동완성" />
        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={8}>
            <Autocomplete.Popup>
              <Autocomplete.Empty>추천 항목 없음</Autocomplete.Empty>
              <Autocomplete.List>
                {(item: string) => (
                  <Autocomplete.Item key={item} value={item}>
                    {item}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      <p role="status">입력값: {value}</p>
    </div>
  );
}
