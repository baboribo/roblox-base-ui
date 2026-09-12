"use client";

import { useState } from "react";
import { Dialog } from "../src/components/ui/dialog";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";

export function DialogExample() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("프로젝트 A");
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger render={<Button variant="emphasis" />}>
          프로젝트 편집
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Title>프로젝트 편집</Dialog.Title>
            <Dialog.Description>프로젝트 이름을 입력하세요.</Dialog.Description>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginTop: 24,
              }}
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(true);
                setOpen(false);
              }}
            >
              <label
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                프로젝트 이름
                <Input value={name} onValueChange={setName} required />
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "flex-end",
                }}
              >
                <Dialog.Close>취소</Dialog.Close>
                <Button type="submit" variant="emphasis">
                  변경사항 저장
                </Button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      {saved && <p role="status">저장됨: {name}</p>}
    </div>
  );
}
