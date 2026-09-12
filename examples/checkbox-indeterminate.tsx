"use client";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxIndeterminateExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Checkbox.Root indeterminate>
        <Checkbox.Indicator>−</Checkbox.Indicator>
      </Checkbox.Root>
      일부 선택
    </label>
  );
}
