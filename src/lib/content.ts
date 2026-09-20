import type { ReactNode } from "react";
/** React에서 표시하지 않는 값만 거릅니다. 숫자 0은 유효한 내용입니다. */
export function hasContent(value: ReactNode) {
  return (
    value !== undefined &&
    value !== null &&
    typeof value !== "boolean" &&
    value !== ""
  );
}
