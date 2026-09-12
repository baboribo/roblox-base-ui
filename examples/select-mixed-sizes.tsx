"use client";
import { Select } from "../src/components/ui/select";
const items = [
  { value: "public", label: "전체 공개" },
  { value: "private", label: "비공개" },
];
export function SelectMixedSizesExample() {
  return (
    <Select.Root items={items} defaultValue="public">
      <Select.Trigger size="sm" aria-label="공개 범위">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup size="lg">
            <Select.List>
              {items.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
