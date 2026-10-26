"use client";
import { useRef, useState } from "react";
import { AlertDialog } from "../src/components/ui/alert-dialog";
import { Button } from "../src/components/ui/button";
import { Inline, Stack } from "../src/components/ui/layout";

const initial = ["하늘섬 탐험 계획", "주말 레이스 연습", "건축 아이디어"];

export function AlertDialogFinalFocusExample() {
  const [items, setItems] = useState(initial);
  const [deleting, setDeleting] = useState<string>();
  const restore = useRef<HTMLButtonElement>(null);
  return (
    <Stack gap={12}>
      <ul style={{ display: "grid", gap: 8, margin: 0, padding: 0 }}>
        {items.map((item) => (
          <li key={item} style={{ listStyle: "none" }}>
            <Inline gap={12} align="center">
              <span>{item}</span>
              <Button
                size="sm"
                variant="alert"
                aria-label={`${item} 삭제`}
                onClick={() => setDeleting(item)}
              >
                삭제
              </Button>
            </Inline>
          </li>
        ))}
      </ul>
      <Button
        ref={restore}
        size="md"
        variant="standard"
        onClick={() => setItems(initial)}
      >
        목록 되돌리기
      </Button>
      <AlertDialog.Root
        open={Boolean(deleting)}
        onOpenChange={(next) => !next && setDeleting(undefined)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          {/* 삭제 버튼이 항목과 함께 사라지므로, 닫힌 뒤 포커스를 남아 있는 버튼으로 보냅니다. */}
          <AlertDialog.Popup finalFocus={restore}>
            <Stack gap={24}>
              <Stack gap={8}>
                <AlertDialog.Title>
                  ‘{deleting}’ 항목을 삭제할까요?
                </AlertDialog.Title>
                <AlertDialog.Description>
                  삭제한 항목은 되돌릴 수 없습니다.
                </AlertDialog.Description>
              </Stack>
              <Inline justify="end" gap={12}>
                <AlertDialog.Close render={<Button variant="standard" />}>
                  취소
                </AlertDialog.Close>
                <AlertDialog.Close
                  render={<Button variant="alert" />}
                  onClick={() =>
                    setItems((list) => list.filter((item) => item !== deleting))
                  }
                >
                  삭제
                </AlertDialog.Close>
              </Inline>
            </Stack>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Stack>
  );
}
