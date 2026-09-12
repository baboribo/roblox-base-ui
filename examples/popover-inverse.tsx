"use client";
import { Popover } from "../src/components/ui/popover";

export function PopoverInverseExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>알림 확인</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup variant="inverse">
            <Popover.Title>알림</Popover.Title>
            <Popover.Description>새 알림이 없습니다.</Popover.Description>
            <Popover.Close>닫기</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
