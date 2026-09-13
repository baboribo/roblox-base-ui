"use client";
import { Icon } from "../src/components/ui/icon";

import { Checkbox } from "../src/components/ui/checkbox";
import { CheckboxGroup } from "../src/components/ui/checkbox-group";

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
              <Icon name="icon-filled-check" size={14} />
            </Checkbox.Indicator>
          </Checkbox.Root>
          {value}
        </label>
      ))}
    </CheckboxGroup>
  );
}
