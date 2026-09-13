"use client";
import { Icon } from "../src/components/ui/icon";
import { useId } from "react";

import { Minus } from "lucide-react";

import { NumberField } from "../src/components/ui/number-field";

export function NumberFieldExample() {
  const fieldId = useId();
  return (
    <NumberField.Root id={fieldId} defaultValue={8} min={1} max={100}>
      <NumberField.ScrubArea>
        <label htmlFor={fieldId}>최대 참여 인원</label>
      </NumberField.ScrubArea>
      <NumberField.Group>
        <NumberField.Decrement aria-label="인원 줄이기">
          <Icon render={<Minus />} size={16} />
        </NumberField.Decrement>
        <NumberField.Input />
        <NumberField.Increment aria-label="인원 늘리기">
          <Icon name="icon-regular-plus-large" size={16} />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
