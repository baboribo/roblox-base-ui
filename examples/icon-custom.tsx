"use client";
import { useState } from "react";
import { Minus } from "lucide-react";
import { Icon } from "../src/components/ui/icon";
import { IconButton } from "../src/components/ui/icon-button";

export function IconCustomExample() {
  const [count, setCount] = useState(5);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Icon name="icon-filled-check" size={24} />
      <Icon render={<Minus strokeWidth={2} />} size={24} />
      <IconButton
        icon={<Minus strokeWidth={2} />}
        aria-label="수량 줄이기"
        size="sm"
        variant="standard"
        disabled={count === 0}
        onClick={() => setCount((value) => value - 1)}
      />
      <span role="status">수량 {count}</span>
    </div>
  );
}
