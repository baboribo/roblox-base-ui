"use client";
import { useState } from "react";
import { Toast } from "../src/components/ui/toast";
import { Button } from "../src/components/ui/button";
function RetryContent() {
  const [status, setStatus] = useState("대기 중");
  const manager = Toast.useToastManager();
  // 처음에는 실패 상황을 보여줍니다. 재시도는 실제 정적 파일을 다시 요청합니다.
  async function retry() {
    setStatus("불러오는 중");
    const loading = manager.add({ title: "불러오는 중입니다", timeout: 0 });
    try {
      const response = await fetch("/r/toast.json");
      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      setStatus(`${data.name} 컴포넌트 · 파일 ${data.files.length}개`);
      manager.update(loading, {
        title: "컴포넌트를 불러왔습니다",
        type: "success",
        timeout: 5000,
      });
    } catch {
      setStatus("불러오기 실패");
      manager.update(loading, {
        title: "불러오지 못했습니다",
        type: "error",
        timeout: 10000,
        actionProps: { children: "다시 시도", onClick: retry },
      });
    }
  }
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <p role="status">{status}</p>
      <Button
        onClick={() => {
          setStatus("불러오기 실패");
          manager.add({
            title: "불러오지 못했습니다",
            type: "error",
            timeout: 10000,
            actionProps: { children: "다시 시도", onClick: retry },
          });
        }}
      >
        실패 상황 재현
      </Button>
    </div>
  );
}
export function ToastRetryExample() {
  return (
    <Toast.Provider>
      <RetryContent />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
