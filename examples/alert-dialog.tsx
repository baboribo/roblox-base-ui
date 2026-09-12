"use client";

import { useState } from "react";
import { AlertDialog } from "../src/components/ui/alert-dialog";
import { Button } from "../src/components/ui/button";

export function AlertDialogExample() {
  const [deleted, setDeleted] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AlertDialog.Root>
        <AlertDialog.Trigger render={<Button variant="alert" />}>
          프로젝트 삭제
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Title>프로젝트를 삭제할까요?</AlertDialog.Title>
            <AlertDialog.Description>
              이 예제에서는 확인 상태만 바뀝니다.
            </AlertDialog.Description>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "flex-end",
                marginTop: 24,
              }}
            >
              <AlertDialog.Close>취소</AlertDialog.Close>
              <AlertDialog.Close
                render={<Button variant="alert" />}
                onClick={() => setDeleted(true)}
              >
                삭제 확인
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      {deleted && <p role="status">예제 프로젝트를 삭제했습니다.</p>}
    </div>
  );
}
