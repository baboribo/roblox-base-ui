"use client";
import { useState } from "react";
import { Sidebar } from "../src/components/ui/sidebar";
import { Button } from "../src/components/ui/button";

export function SidebarResponsiveExample() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("overview");
  return (
    <Sidebar.Provider open={open} onOpenChange={setOpen}>
      <Sidebar.Trigger render={<Button size="sm" />}>
        예제 탐색 열기
      </Sidebar.Trigger>
      <Sidebar.Panel
        title="반응형 탐색 예제"
        closeLabel="예제 탐색 닫기"
        style={{ height: 220 }}
      >
        <Sidebar.Header>프로젝트</Sidebar.Header>
        <Sidebar.Content>
          <nav aria-label="프로젝트 화면 선택">
            <Sidebar.Menu>
              {(
                [
                  ["overview", "개요", "icon-regular-house"],
                  ["library", "보관함", "icon-regular-backpack"],
                ] as const
              ).map(([id, label, icon]) => (
                <Sidebar.Item key={id}>
                  <Sidebar.Action
                    active={selected === id}
                    icon={icon}
                    onClick={() => {
                      setSelected(id);
                      setOpen(false);
                    }}
                  >
                    {label}
                  </Sidebar.Action>
                </Sidebar.Item>
              ))}
            </Sidebar.Menu>
          </nav>
        </Sidebar.Content>
      </Sidebar.Panel>
      <p role="status">
        현재 화면: {selected === "overview" ? "개요" : "보관함"}
      </p>
    </Sidebar.Provider>
  );
}
