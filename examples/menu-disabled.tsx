"use client";
import { Menu } from "../src/components/ui/menu";

export function MenuDisabledExample() {
  return (
    <Menu.Root>
      <Menu.Trigger>프로젝트 메뉴</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Item>이름 변경</Menu.Item>
            <Menu.Item disabled>이동</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
