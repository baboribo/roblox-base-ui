"use client";

import { useState } from "react";
import { Bold, Italic } from "lucide-react";
import { Toolbar } from "../src/components/ui/toolbar";

export function ToolbarExample() {
  const [message, setMessage] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Toolbar.Root aria-label="편집 도구">
        <Toolbar.Button
          onClick={() => setMessage("굵게 적용")}
          aria-label="굵게"
        >
          <Bold size={18} />
        </Toolbar.Button>
        <Toolbar.Button
          onClick={() => setMessage("기울임 적용")}
          aria-label="기울임"
        >
          <Italic size={18} />
        </Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button onClick={() => setMessage("변경사항 저장")}>
          저장
        </Toolbar.Button>
      </Toolbar.Root>
      <p role="status">{message}</p>
    </div>
  );
}
