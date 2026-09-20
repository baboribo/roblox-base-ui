"use client";
import { useCallback, type Ref, type RefObject } from "react";
/** 내부 측정 ref와 호출자의 ref를 함께 연결하고 React 19의 ref 정리 함수도 보존합니다. */
export function useMergedRef<T>(local: RefObject<T | null>, external?: Ref<T>) {
  return useCallback(
    (node: T | null) => {
      local.current = node;
      const cleanup =
        typeof external === "function" ? external(node) : undefined;
      if (external && typeof external !== "function") external.current = node;
      return () => {
        local.current = null;
        if (typeof cleanup === "function") cleanup();
        else if (typeof external === "function") external(null);
        else if (external) external.current = null;
      };
    },
    [local, external],
  );
}
