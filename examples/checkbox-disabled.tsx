"use client";
import { Icon } from "../src/components/ui/icon";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxDisabledExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Checkbox.Root disabled>
        <Checkbox.Indicator>
          <Icon name="icon-filled-check" size={16} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      비활성
    </label>
  );
}
