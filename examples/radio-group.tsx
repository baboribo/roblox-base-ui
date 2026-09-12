"use client";

import { Radio } from "../src/components/ui/radio";
import { RadioGroup } from "../src/components/ui/radio-group";

export function RadioExample() {
  return (
    <RadioGroup defaultValue="everyone" aria-label="참여할 수 있는 사람">
      {[
        ["everyone", "누구나"],
        ["friends", "친구만"],
        ["invite", "초대받은 사람"],
      ].map(([value, label]) => (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
          key={value}
        >
          <Radio.Root value={value}>
            <Radio.Indicator />
          </Radio.Root>
          {label}
        </label>
      ))}
    </RadioGroup>
  );
}
