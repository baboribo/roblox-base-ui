"use client";
import { useState } from "react";
import { Button } from "../src/components/ui/button";
import { Dialog } from "../src/components/ui/dialog";
import { Menu } from "../src/components/ui/menu";
import { Popover } from "../src/components/ui/popover";
import { Tooltip } from "../src/components/ui/tooltip";
import { Toast } from "../src/components/ui/toast";
import { Input } from "../src/components/ui/input";
function Notify() {
  const manager = Toast.useToastManager();
  return (
    <Button
      onClick={() =>
        manager.add({
          title: "저장했습니다",
          description: "변경사항을 반영했습니다.",
          timeout: 0,
        })
      }
    >
      테마 알림
    </Button>
  );
}
export function PortalThemeExample() {
  const [theme, setTheme] = useState("dark");
  return (
    <div>
      <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        영역 테마 전환
      </Button>
      <section
        data-testid="theme-boundary"
        data-theme={theme}
        style={{
          padding: 20,
          marginTop: 16,
          background: "var(--rbx-color-surface-100)",
          color: "var(--rbx-color-content-emphasis)",
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Dialog.Root>
          <Dialog.Trigger>테마 대화상자</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
              <Dialog.Title>프로젝트 이름</Dialog.Title>
              <Dialog.Description>변경할 이름을 입력하세요.</Dialog.Description>
              <Input aria-label="프로젝트 이름 입력" />
              <Dialog.Close>닫기</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <Menu.Root>
          <Menu.Trigger>테마 메뉴</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={8}>
              <Menu.Popup>
                <Menu.Item>이름 변경</Menu.Item>
                <Menu.Item>복제</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <Popover.Root>
          <Popover.Trigger>테마 팝오버</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8}>
              <Popover.Popup>
                <Popover.Title>공개 범위</Popover.Title>
                <Popover.Description>
                  팀 구성원만 볼 수 있습니다.
                </Popover.Description>
                <Popover.Close>닫기</Popover.Close>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>테마 도움말</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner sideOffset={8}>
                <Tooltip.Popup>
                  프로젝트 설정을 확인하세요.
                  <Tooltip.Arrow>
                    <svg width="12" height="6">
                      <path d="M0 0h12L6 6z" />
                    </svg>
                  </Tooltip.Arrow>
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
        <Toast.Provider>
          <Notify />
          <Toast.Toaster />
        </Toast.Provider>
      </section>
    </div>
  );
}
