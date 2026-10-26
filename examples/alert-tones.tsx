"use client";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../src/components/ui/alert";

export function AlertTonesExample() {
  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <Alert tone="success">
        <AlertTitle>저장했습니다</AlertTitle>
        <AlertDescription>
          다음 대화부터 바뀐 설정을 사용합니다.
        </AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>저장 공간이 거의 찼습니다</AlertTitle>
        <AlertDescription>
          오래된 대화를 지우면 새 기억을 더 저장할 수 있습니다.
        </AlertDescription>
      </Alert>
      <Alert tone="error">
        <AlertTitle>설정을 저장하지 못했습니다</AlertTitle>
        <AlertDescription>
          네트워크 연결을 확인한 뒤 다시 시도해 주세요.
        </AlertDescription>
      </Alert>
    </div>
  );
}
