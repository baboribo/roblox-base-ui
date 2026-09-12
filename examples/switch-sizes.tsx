"use client";
import { Switch } from "../src/components/ui/switch";

export function SwitchSizesExample() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Switch.Root size="xs" defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        xs
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Switch.Root size="sm" defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        sm
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Switch.Root size="md" defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        md
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Switch.Root size="lg" defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        lg
      </label>
    </div>
  );
}
