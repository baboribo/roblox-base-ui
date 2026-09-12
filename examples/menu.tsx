"use client";

import { useState } from "react";
import { Menu } from "../src/components/ui/menu";

export function MenuExample() {
  const [status, setStatus] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Menu.Root>
        <Menu.Trigger>프로젝트 메뉴</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8}>
            <Menu.Popup>
              <Menu.Item
                onClick={() => setStatus("프로젝트 이름 변경을 선택했습니다.")}
              >
                이름 변경
              </Menu.Item>
              <Menu.Item onClick={() => setStatus("프로젝트를 복제했습니다.")}>
                복제
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      {status && <p role="status">{status}</p>}
    </div>
  );
}
