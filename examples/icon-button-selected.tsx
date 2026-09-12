"use client";
import { useState } from "react";
import { IconButton } from "../src/components/ui/icon-button";

export function IconButtonSelectedExample() {
  const [selected, setSelected] = useState(false);
  return (
    <IconButton
      icon="icon-regular-gear"
      aria-label="설정 고정"
      variant="utility"
      selected={selected}
      aria-pressed={selected}
      onClick={() => setSelected(!selected)}
    />
  );
}
