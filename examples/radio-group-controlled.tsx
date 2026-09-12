"use client";
import { useState } from "react";
import { RadioGroup } from "../src/components/ui/radio-group";
import { Radio } from "../src/components/ui/radio";

export function RadioGroupControlledExample() {
  const [value, setValue] = useState<string | null>("public");
  return (
    <div>
      <RadioGroup
        aria-label="공개 범위"
        value={value}
        onValueChange={(next) =>
          setValue(typeof next === "string" ? next : null)
        }
      >
        {["public", "private"].map((item) => (
          <label
            key={item}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <Radio.Root value={item}>
              <Radio.Indicator />
            </Radio.Root>
            {item}
          </label>
        ))}
      </RadioGroup>
      <p role="status">선택값: {value}</p>
    </div>
  );
}
