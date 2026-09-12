"use client";
import { Select } from "../src/components/ui/select";
const items = [
  { value: "public", label: "전체 공개" },
  { value: "friends", label: "친구만" },
  { value: "private", label: "비공개" },
];
export function SelectMultipleExample() {
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <Select.Root items={items} multiple defaultValue={["public", "friends"]}>
        <Select.Trigger size="lg" aria-label="공개 범위">
          <Select.Value placeholder="공개 범위 선택" />
          <Select.Icon>⌄</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup size="lg">
              <Select.List>
                {items.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    <Select.ItemIndicator>✓</Select.ItemIndicator>
                    <Select.ItemText>{item.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
