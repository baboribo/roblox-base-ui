"use client";
import { Radio } from "../src/components/ui/radio";
import { RadioGroup } from "../src/components/ui/radio-group";

export function RadioDisabledExample() {
  return (
    <RadioGroup aria-label="공개 범위" defaultValue="public">
      <label>
        <Radio.Root value="public">
          <Radio.Indicator />
        </Radio.Root>
        전체 공개
      </label>
      <label>
        <Radio.Root value="private" disabled>
          <Radio.Indicator />
        </Radio.Root>
        비공개
      </label>
    </RadioGroup>
  );
}
