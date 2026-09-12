"use client";

import { Bold, Italic, Underline } from "lucide-react";
import { Toggle } from "../src/components/ui/toggle";
import { ToggleGroup } from "../src/components/ui/toggle-group";

export function ToggleGroupExample() {
  return (
    <ToggleGroup multiple defaultValue={["bold"]} aria-label="텍스트 스타일">
      <Toggle value="bold" aria-label="굵게">
        <Bold size={18} />
      </Toggle>
      <Toggle value="italic" aria-label="기울임">
        <Italic size={18} />
      </Toggle>
      <Toggle value="underline" aria-label="밑줄">
        <Underline size={18} />
      </Toggle>
    </ToggleGroup>
  );
}
