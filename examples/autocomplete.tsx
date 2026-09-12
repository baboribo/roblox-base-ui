"use client";

import { Autocomplete } from "../src/components/ui/autocomplete";

const genres = [
  "Adventure",
  "Creative",
  "Racing",
  "Roleplay",
  "Simulation",
  "Sports",
];

export function AutocompleteExample() {
  return (
    <Autocomplete.Root items={genres}>
      <Autocomplete.Input
        aria-label="장르 자동완성"
        placeholder="장르를 자유롭게 입력하세요"
      />
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
  );
}
