"use client";
import { Tabs } from "../src/components/ui/tabs";

export function TabsManualExample() {
  return (
    <Tabs.Root defaultValue="info">
      <Tabs.List activateOnFocus={false} aria-label="프로젝트">
        <Tabs.Tab value="info">정보</Tabs.Tab>
        <Tabs.Tab value="settings">설정</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="info">프로젝트 정보입니다.</Tabs.Panel>
      <Tabs.Panel value="settings">프로젝트 설정입니다.</Tabs.Panel>
    </Tabs.Root>
  );
}
