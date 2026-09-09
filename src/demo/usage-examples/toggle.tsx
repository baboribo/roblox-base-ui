"use client";

import { Bold } from "lucide-react";
import { Toggle } from "../../components/ui/toggle";

export function ToggleExample() {
  return (
    <Toggle aria-label="굵게">
      <Bold size={18} />
    </Toggle>
  );
}
