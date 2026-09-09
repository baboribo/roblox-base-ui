"use client";

import { Collapsible } from "../../components/ui/collapsible";

export function CollapsibleExample() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>세부 설정 펼치기</Collapsible.Trigger>
      <Collapsible.Panel>
        <div style={{ marginTop: 24 }}>
          자동 저장: 사용 · 프로젝트 형식: React
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
