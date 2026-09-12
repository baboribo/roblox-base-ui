"use client";
import { useState } from "react";
import { CheckboxGroup } from "../src/components/ui/checkbox-group";
import { Checkbox } from "../src/components/ui/checkbox";

export function CheckboxGroupControlledExample() {
  const [value, setValue] = useState<string[]>(["email"]);
  return (
    <div>
      <CheckboxGroup
        aria-label="알림 채널"
        value={value}
        onValueChange={setValue}
      >
        {["email", "push"].map((item) => (
          <label
            key={item}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <Checkbox.Root value={item}>
              <Checkbox.Indicator>✓</Checkbox.Indicator>
            </Checkbox.Root>
            {item}
          </label>
        ))}
      </CheckboxGroup>
      <p role="status">선택값: {value.join(", ") || "없음"}</p>
    </div>
  );
}
