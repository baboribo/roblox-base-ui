"use client";
import { useRef, useState } from "react";
import { Toast } from "../src/components/ui/toast";
import { Button } from "../src/components/ui/button";
import { Dialog } from "../src/components/ui/dialog";
function MoveFile() {
  const [location, setLocation] = useState("내 파일");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const manager = Toast.useToastManager();
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <p role="status">기획안.pdf · {location}</p>
      <Button
        ref={triggerRef}
        onClick={() => {
          setLocation("보관함");
          const id = manager.add({
            title: "보관함으로 이동했습니다",
            timeout: 10000,
            actionProps: {
              children: "변경",
              onClick: () => {
                manager.close(id);
                setOpen(true);
              },
            },
          });
        }}
      >
        보관함으로 이동
      </Button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="sm" finalFocus={triggerRef}>
            <Dialog.CloseAffordance aria-label="닫기" />
            <Dialog.Body>
              <Dialog.Title>이동 위치 변경</Dialog.Title>
              <Dialog.Description>
                파일을 옮길 위치를 선택하세요.
              </Dialog.Description>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 16,
                  flexWrap: "wrap",
                }}
              >
                {["내 파일", "작업 폴더"].map((folder) => (
                  <Button
                    key={folder}
                    onClick={() => {
                      setLocation(folder);
                      setOpen(false);
                      manager.add({
                        title: `${folder}로 이동했습니다`,
                        type: "success",
                      });
                    }}
                  >
                    {folder}
                  </Button>
                ))}
              </div>
            </Dialog.Body>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
export function ToastChangeExample() {
  return (
    <Toast.Provider>
      <MoveFile />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
