"use client";

import { Tabs } from "../src/components/ui/tabs";

export function TabsExample() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        {[
          ["overview", "개요"],
          ["settings", "설정"],
          ["activity", "활동"],
        ].map(([value, label]) => (
          <Tabs.Tab value={value} key={value}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <Tabs.Panel value="overview">프로젝트의 기본 정보입니다.</Tabs.Panel>
      <Tabs.Panel value="settings">프로젝트 설정입니다.</Tabs.Panel>
      <Tabs.Panel value="activity">활동 내역이 없습니다.</Tabs.Panel>
    </Tabs.Root>
  );
}
