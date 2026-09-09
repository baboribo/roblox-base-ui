"use client";

import { Drawer } from "../../components/ui/drawer";

export function DrawerExample() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>상세 패널 열기</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Content>
              <Drawer.Title>경험 설정</Drawer.Title>
              <Drawer.Description>
                아래로 스와이프하거나 닫기 버튼을 누르세요.
              </Drawer.Description>
              <div style={{ marginTop: 24 }}>
                <Drawer.Close>닫기</Drawer.Close>
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
