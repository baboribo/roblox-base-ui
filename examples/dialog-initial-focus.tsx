"use client";
import { useRef, useState } from "react";
import { Dialog } from "../src/components/ui/dialog";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Button } from "../src/components/ui/button";
import { Stack } from "../src/components/ui/layout";

export function DialogInitialFocusExample() {
  const [name, setName] = useState("하늘섬 탐험 계획");
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <Stack gap={12}>
      <p style={{ margin: 0 }}>현재 이름: {name}</p>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger render={<Button size="md" variant="standard" />}>
          이름 바꾸기
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          {/* 입력이 목적인 대화상자는 닫기 버튼보다 입력칸에 먼저 포커스를 둡니다. */}
          <Dialog.Popup size="sm" initialFocus={input}>
            <Dialog.CloseAffordance />
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                setName(
                  String(new FormData(event.currentTarget).get("name")).trim(),
                );
                setOpen(false);
              }}
            >
              <Dialog.Body>
                <Stack gap={16}>
                  <Dialog.Title>이름 바꾸기</Dialog.Title>
                  <Field.Root name="name">
                    <Field.Label>새 이름</Field.Label>
                    <Field.Control
                      ref={input}
                      defaultValue={name}
                      required
                      maxLength={40}
                    />
                    <Field.Error match="valueMissing">
                      이름을 입력하세요.
                    </Field.Error>
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button size="md" variant="standard" />}>
                  취소
                </Dialog.Close>
                <Button size="md" type="submit">
                  저장
                </Button>
              </Dialog.Footer>
            </Form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </Stack>
  );
}
