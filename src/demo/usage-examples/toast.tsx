"use client";

import { X } from "lucide-react";
import { Toast } from "../../components/ui/toast";
import { Button } from "../../components/ui/button";

function ToastContent() {
  const manager = Toast.useToastManager();
  return (
    <>
      <Button
        onClick={() =>
          manager.add({
            title: "변경사항을 저장했습니다",
            description: "설정이 적용되었습니다.",
          })
        }
      >
        알림 띄우기
      </Button>
      <Toast.Portal>
        <Toast.Viewport>
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <Toast.Title />
              <Toast.Description />
              <Toast.Close aria-label="알림 닫기">
                <X size={16} />
              </Toast.Close>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </>
  );
}

export function ToastExample() {
  return (
    <Toast.Provider timeout={5000}>
      <ToastContent />
    </Toast.Provider>
  );
}
