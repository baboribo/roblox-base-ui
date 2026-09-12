"use client";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxSizesExample() {
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
        <Checkbox.Root size="xs" defaultChecked>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        xs · 16px
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Checkbox.Root size="sm" defaultChecked>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        sm · 20px
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Checkbox.Root size="md" defaultChecked>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        md · 24px
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Checkbox.Root size="lg" defaultChecked>
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        lg · 24px
      </label>
    </div>
  );
}
