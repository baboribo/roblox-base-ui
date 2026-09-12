"use client";
import { Menu } from "../src/components/ui/menu";

export function MenuMdExample() {
  return (
    <Menu.Root>
      <Menu.Trigger>프로젝트 메뉴 md</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup size="md">
            <Menu.Item>이름 변경</Menu.Item>
            <Menu.Item>복제</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
