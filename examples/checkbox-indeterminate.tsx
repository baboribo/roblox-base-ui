"use client";
import { Icon } from "../src/components/ui/icon";
import { Minus } from "lucide-react";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxIndeterminateExample() {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Checkbox.Root indeterminate>
        <Checkbox.Indicator>
          <Icon render={<Minus />} size={16} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      일부 선택
    </label>
  );
}
