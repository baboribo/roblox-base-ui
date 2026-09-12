"use client";
import { useState } from "react";
import { Toast } from "../src/components/ui/toast";
import { Button } from "../src/components/ui/button";
function FileList() {
  const [files, setFiles] = useState(["기획안.pdf"]);
  const manager = Toast.useToastManager();
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <p aria-live="polite">
        {files.length ? files.join(", ") : "파일이 없습니다."}
      </p>
      <Button
        disabled={!files.length}
        onClick={() => {
          const removed = files;
          setFiles([]);
          manager.add({
            title: "파일을 삭제했습니다",
            timeout: 10000,
            actionProps: {
              children: "실행 취소",
              onClick: () => {
                setFiles(removed);
                manager.add({ title: "파일을 복원했습니다", type: "success" });
              },
            },
          });
        }}
      >
        파일 삭제
      </Button>
    </div>
  );
}
export function ToastUndoExample() {
  return (
    <Toast.Provider>
      <FileList />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
