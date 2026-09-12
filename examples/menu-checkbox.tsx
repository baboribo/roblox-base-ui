"use client";
import { useState } from "react";
import { Menu } from "../src/components/ui/menu";

export function MenuCheckboxExample() {
  const [checked, setChecked] = useState(false);
  return (
    <Menu.Root>
      <Menu.Trigger>보기 설정</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup>
            <Menu.CheckboxItem checked={checked} onCheckedChange={setChecked}>
              즐겨찾기<Menu.CheckboxItemIndicator>✓</Menu.CheckboxItemIndicator>
            </Menu.CheckboxItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
