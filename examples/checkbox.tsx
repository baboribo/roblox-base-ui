"use client";
import { Icon } from "../src/components/ui/icon";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Checkbox.Root>
        <Checkbox.Indicator>
          <Icon name="icon-filled-check" size={16} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      업데이트 소식 받기
    </label>
  );
}
