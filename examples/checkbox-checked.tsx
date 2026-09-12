"use client";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxCheckedExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Checkbox.Root defaultChecked>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
      선택된 초기값
    </label>
  );
}
