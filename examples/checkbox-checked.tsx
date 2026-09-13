"use client";
import { Icon } from "../src/components/ui/icon";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxCheckedExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Checkbox.Root defaultChecked>
        <Checkbox.Indicator>
          <Icon name="icon-filled-check" size={16} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      선택된 초기값
    </label>
  );
}
