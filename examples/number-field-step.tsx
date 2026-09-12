"use client";
import { NumberField } from "../src/components/ui/number-field";

export function NumberFieldStepExample() {
  return (
    <NumberField.Root min={0} max={100} step={5} defaultValue={50}>
      <NumberField.Group>
        <NumberField.Decrement aria-label="5 줄이기">−</NumberField.Decrement>
        <NumberField.Input aria-label="음량" />
        <NumberField.Increment aria-label="5 늘리기">+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
