"use client";

import { Check } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import { CheckboxGroup } from "../../components/ui/checkbox-group";

export function CheckboxGroupExample() {
  return (
    <CheckboxGroup defaultValue={["email"]} aria-label="알림 채널">
      {["email", "push", "sms"].map((value) => (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
          key={value}
        >
          <Checkbox.Root value={value}>
            <Checkbox.Indicator>
              <Check size={14} />
            </Checkbox.Indicator>
          </Checkbox.Root>
          {value}
        </label>
      ))}
    </CheckboxGroup>
  );
}
