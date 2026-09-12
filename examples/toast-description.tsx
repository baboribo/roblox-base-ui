"use client";
import { Toast } from "../src/components/ui/toast";
import { Button } from "../src/components/ui/button";
function UploadButton() {
  const manager = Toast.useToastManager();
  return (
    <Button
      onClick={() =>
        manager.add({
          title: "업로드하지 못했습니다",
          description: "파일은 20MB까지 올릴 수 있습니다.",
          type: "error",
          timeout: 8000,
        })
      }
    >
      설명이 있는 알림 보기
    </Button>
  );
}
export function ToastDescriptionExample() {
  return (
    <Toast.Provider>
      <UploadButton />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
