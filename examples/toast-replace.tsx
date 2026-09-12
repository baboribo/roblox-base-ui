"use client";
import { useRef } from "react";
import { Toast } from "../src/components/ui/toast";
import { Button } from "../src/components/ui/button";
function Notify() {
  const count = useRef(0);
  const manager = Toast.useToastManager();
  return (
    <Button
      onClick={() => {
        count.current += 1;
        manager.add({ title: `${count.current}번째 알림입니다` });
      }}
    >
      새 알림 표시
    </Button>
  );
}
export function ToastReplaceExample() {
  return (
    <Toast.Provider>
      <Notify />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
