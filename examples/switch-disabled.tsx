"use client";
import { Switch } from "../src/components/ui/switch";

export function SwitchDisabledExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Switch.Root disabled>
        <Switch.Thumb />
      </Switch.Root>
      활동 상태 표시
    </label>
  );
}
