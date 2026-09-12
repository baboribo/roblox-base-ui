"use client";
import { Dialog } from "../src/components/ui/dialog";

export function DialogCloseExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>대화상자 열기</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.CloseAffordance aria-label="닫기" />
          <Dialog.Body>
            <Dialog.Title>프로젝트 정보</Dialog.Title>
            <Dialog.Description>
              오른쪽 위 버튼으로 닫을 수 있습니다.
            </Dialog.Description>
          </Dialog.Body>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
