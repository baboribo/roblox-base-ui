"use client";
import { Icon } from "../src/components/ui/icon";
import { Minus } from "lucide-react";
import { NumberField } from "../src/components/ui/number-field";

export function NumberFieldStepExample() {
  return (
    <NumberField.Root min={0} max={100} step={5} defaultValue={50}>
      <NumberField.Group>
        <NumberField.Decrement aria-label="5 줄이기">
          <Icon render={<Minus />} size={16} />
        </NumberField.Decrement>
        <NumberField.Input aria-label="음량" />
        <NumberField.Increment aria-label="5 늘리기">
          <Icon name="icon-regular-plus-large" size={16} />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
