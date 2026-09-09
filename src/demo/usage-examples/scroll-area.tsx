"use client";

import { ScrollArea } from "../../components/ui/scroll-area";

export function ScrollAreaExample() {
  return (
    <ScrollArea.Root style={{ height: 200 }}>
      <ScrollArea.Viewport tabIndex={0} aria-label="업데이트 목록">
        {Array.from({ length: 14 }, (_, i) => (
          <p key={i}>
            업데이트 {String(i + 1).padStart(2, "0")} — 새로운 경험을 준비하고
            있습니다.
          </p>
        ))}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
