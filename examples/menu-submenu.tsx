"use client";
import { Menu } from "../src/components/ui/menu";

export function MenuSubmenuExample() {
  return (
    <Menu.Root>
      <Menu.Trigger>프로젝트 메뉴</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.Item>이름 변경</Menu.Item>
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger>내보내기</Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={8}>
                  <Menu.Popup>
                    <Menu.Item>PNG</Menu.Item>
                    <Menu.Item>SVG</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
