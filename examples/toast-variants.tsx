"use client";
import { Toast } from "../src/components/ui/toast";
import { Button } from "../src/components/ui/button";
function StatusButtons() {
  const manager = Toast.useToastManager();
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button onClick={() => manager.add({ title: "새 버전이 있습니다" })}>
        기본
      </Button>
      <Button
        onClick={() => manager.add({ title: "저장했습니다", type: "success" })}
      >
        성공
      </Button>
      <Button
        onClick={() =>
          manager.add({ title: "저장하지 못했습니다", type: "error" })
        }
      >
        오류
      </Button>
    </div>
  );
}
export function ToastVariantsExample() {
  return (
    <Toast.Provider>
      <StatusButtons />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
