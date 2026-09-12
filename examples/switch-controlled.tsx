"use client";
import { useState } from "react";
import { Switch } from "../src/components/ui/switch";

export function SwitchControlledExample() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Switch.Root checked={enabled} onCheckedChange={setEnabled}>
          <Switch.Thumb />
        </Switch.Root>
        변경사항 자동 저장
      </label>
      <p role="status">자동 저장: {enabled ? "켜짐" : "꺼짐"}</p>
    </div>
  );
}
