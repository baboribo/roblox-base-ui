"use client";

import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../src/components/ui/alert";

export function AlertExample() {
  return (
    <Alert>
      <AlertTitle>새로운 설정을 사용할 수 있습니다</AlertTitle>
      <AlertDescription>
        원하는 테마와 강조색으로 변경해보세요.
      </AlertDescription>
    </Alert>
  );
}
