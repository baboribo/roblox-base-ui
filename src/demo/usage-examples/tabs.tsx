"use client";

import { Tabs } from "../../components/ui/tabs";

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
      <Tabs.Panel value="overview">경험을 만들고 공유해보세요.</Tabs.Panel>
      <Tabs.Panel value="settings">
        설정을 원하는 대로 변경할 수 있습니다.
      </Tabs.Panel>
      <Tabs.Panel value="activity">아직 새로운 활동이 없습니다.</Tabs.Panel>
    </Tabs.Root>
  );
}
