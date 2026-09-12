"use client";

import { useState } from "react";
import { Sidebar } from "../src/components/ui/sidebar";
import { Badge } from "../src/components/ui/badge";
import { type IconName } from "../src/components/ui/icon";

const items: { label: string; icon: IconName }[] = [
  { label: "Home", icon: "icon-regular-house" },
  { label: "Profile", icon: "icon-regular-person" },
  { label: "Connections", icon: "icon-regular-two-people" },
  { label: "Avatar", icon: "icon-regular-person-standing" },
  { label: "Inventory", icon: "icon-regular-backpack" },
  { label: "Communities", icon: "icon-regular-three-people" },
];

export function SidebarExample() {
  const [selected, setSelected] = useState("Home");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Sidebar.Root
        aria-label="사이드바 예제"
        style={{ height: 320, marginInline: "auto" }}
      >
        <Sidebar.Content>
          <nav aria-label="예제 탐색">
            <Sidebar.Menu>
              {items.map(({ label, icon }) => (
                <Sidebar.Item key={label}>
                  <Sidebar.Action
                    icon={icon}
                    active={selected === label}
                    trailing={
                      label === "Connections" ? <Badge>12</Badge> : undefined
                    }
                    onClick={() => setSelected(label)}
                  >
                    {label}
                  </Sidebar.Action>
                </Sidebar.Item>
              ))}
            </Sidebar.Menu>
          </nav>
        </Sidebar.Content>
      </Sidebar.Root>
      <p style={{ color: "var(--rbx-color-content-muted)" }} role="status">
        선택: {selected}
      </p>
    </div>
  );
}
