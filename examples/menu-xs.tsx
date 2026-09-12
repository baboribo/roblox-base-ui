"use client";
import { Menu } from "../src/components/ui/menu";

export function MenuXsExample() {
  return (
    <Menu.Root>
      <Menu.Trigger>프로젝트 메뉴 xs</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup size="xs">
            <Menu.Item>이름 변경</Menu.Item>
            <Menu.Item>복제</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
