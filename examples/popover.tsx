"use client";

import { Popover } from "../src/components/ui/popover";

export function PopoverExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>알림 확인</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup>
            <Popover.Title>모두 확인했습니다</Popover.Title>
            <Popover.Description>
              새로운 알림이 도착하면 여기에 표시됩니다.
            </Popover.Description>
            <div style={{ marginTop: 24 }}>
              <Popover.Close>확인</Popover.Close>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
