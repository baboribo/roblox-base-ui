"use client";
import { Tabs } from "../src/components/ui/tabs";

export function TabsDisabledExample() {
  return (
    <Tabs.Root defaultValue="info">
      <Tabs.List aria-label="프로젝트">
        <Tabs.Tab value="info">정보</Tabs.Tab>
        <Tabs.Tab value="logs" disabled>
          기록
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel value="info">프로젝트 정보입니다.</Tabs.Panel>
        <Tabs.Panel value="logs">기록입니다.</Tabs.Panel>
      </Tabs.Panels>
    </Tabs.Root>
  );
}
