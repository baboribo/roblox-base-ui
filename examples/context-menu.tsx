"use client";

import { useState } from "react";
import { ContextMenu } from "../src/components/ui/context-menu";

export function ContextMenuExample() {
  const [status, setStatus] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <ContextMenu.Root>
        <ContextMenu.Trigger tabIndex={0}>
          우클릭 또는 Shift + F10
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Item onClick={() => setStatus("복제했습니다.")}>
                복제
              </ContextMenu.Item>
              <ContextMenu.Item
                onClick={() => setStatus("즐겨찾기에 추가했습니다.")}
              >
                즐겨찾기
              </ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <p role="status">{status}</p>
    </div>
  );
}
