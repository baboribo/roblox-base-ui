"use client";

import { useState } from "react";
import { Menubar } from "../src/components/ui/menubar";
import { Menu } from "../src/components/ui/menu";

export function MenubarExample() {
  const [message, setMessage] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Menubar>
        {["파일", "편집", "보기"].map((title) => (
          <Menu.Root key={title}>
            <Menu.Trigger>{title}</Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner sideOffset={8}>
                <Menu.Popup>
                  <Menu.Item
                    onClick={() => setMessage(`${title}: 첫 번째 항목 선택`)}
                  >
                    첫 번째 항목
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setMessage(`${title}: 두 번째 항목 선택`)}
                  >
                    두 번째 항목
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        ))}
      </Menubar>
      <p role="status">{message}</p>
    </div>
  );
}
