"use client";
import { ToggleGroup } from "../src/components/ui/toggle-group";
import { Toggle } from "../src/components/ui/toggle";

export function ToggleGroupSingleExample() {
  return (
    <ToggleGroup defaultValue={["left"]} aria-label="정렬">
      <Toggle value="left">왼쪽</Toggle>
      <Toggle value="center">가운데</Toggle>
      <Toggle value="right">오른쪽</Toggle>
    </ToggleGroup>
  );
}
