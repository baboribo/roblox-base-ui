"use client";

import { Button } from "../../components/ui/button";
import { Empty } from "../../components/ui/empty";

export function EmptyExample() {
  return (
    <Empty>
      <h3>아직 프로젝트가 없습니다</h3>
      <p>컴포넌트를 복사해 첫 화면을 만들어보세요.</p>
      <Button render={<a href="#install" />} nativeButton={false}>
        설치 방법 보기
      </Button>
    </Empty>
  );
}
