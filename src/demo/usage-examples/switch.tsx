"use client";

import { Switch } from "../../components/ui/switch";

export function SwitchExample() {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <Switch.Root defaultChecked>
        <Switch.Thumb />
      </Switch.Root>
      활동 상태 표시
    </label>
  );
}
