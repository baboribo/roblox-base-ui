"use client";
import { Dialog } from "../src/components/ui/dialog";

export function DialogSmExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>대화상자 sm</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup size="sm">
          <Dialog.Body>
            <Dialog.Title>프로젝트 설정</Dialog.Title>
            <Dialog.Description>
              프로젝트의 공개 범위를 확인합니다.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close>닫기</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
