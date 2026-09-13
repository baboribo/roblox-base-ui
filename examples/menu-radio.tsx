"use client";
import { Icon } from "../src/components/ui/icon";
import { Menu } from "../src/components/ui/menu";

export function MenuRadioExample() {
  return (
    <Menu.Root>
      <Menu.Trigger>정렬 설정</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.RadioGroup defaultValue="recent">
              <Menu.RadioItem value="recent">
                최근 수정순
                <Menu.RadioItemIndicator>
                  <Icon name="icon-filled-check" size={16} />
                </Menu.RadioItemIndicator>
              </Menu.RadioItem>
              <Menu.RadioItem value="name">
                이름순
                <Menu.RadioItemIndicator>
                  <Icon name="icon-filled-check" size={16} />
                </Menu.RadioItemIndicator>
              </Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
