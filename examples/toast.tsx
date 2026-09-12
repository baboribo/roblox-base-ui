"use client";
import { Toast } from "../src/components/ui/toast";
import { Button } from "../src/components/ui/button";

function SaveButton() {
  const manager = Toast.useToastManager();
  return (
    <Button
      onClick={() => manager.add({ title: "저장했습니다", type: "success" })}
    >
      저장 알림 보기
    </Button>
  );
}
export function ToastExample() {
  return (
    <Toast.Provider timeout={5000}>
      <SaveButton />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
