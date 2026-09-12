"use client";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxDisabledExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Checkbox.Root disabled>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
      비활성
    </label>
  );
}
