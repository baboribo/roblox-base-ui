"use client";
import { useId } from "react";

import { Check, ChevronDown } from "lucide-react";
import { Select } from "../src/components/ui/select";

const visibility = [
  { value: "public", label: "전체 공개" },
  { value: "friends", label: "친구만" },
  { value: "private", label: "비공개" },
];

export function SelectExample() {
  const labelId = useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <span id={labelId}>공개 범위</span>
      <Select.Root items={visibility} defaultValue="public">
        <Select.Trigger aria-labelledby={labelId}>
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={16} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={8} alignItemWithTrigger={false}>
            <Select.Popup>
              <Select.List>
                {visibility.map((item) => (
                  <Select.Item value={item.value} key={item.value}>
                    <Select.ItemIndicator>
                      <Check size={14} />
                    </Select.ItemIndicator>
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
