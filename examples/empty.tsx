"use client";

import { Button } from "../src/components/ui/button";
import { Empty } from "../src/components/ui/empty";

export function EmptyExample() {
  return (
    <Empty>
      <h3>아직 프로젝트가 없습니다</h3>
      <p>설치 방법을 확인할 수 있습니다.</p>
      <Button
        render={<a href="/docs/installation" target="_top" />}
        nativeButton={false}
      >
        설치 방법 보기
      </Button>
    </Empty>
  );
}
