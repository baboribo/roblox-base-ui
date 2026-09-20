"use client";

import type { ComponentProps } from "react";
import { AlertDialog as Primitive } from "@base-ui/react/alert-dialog";
import { withClassName } from "../../lib/cx";
import { createThemedPortal } from "../../lib/create-themed-portal";
import "./alert-dialog.css";

const ThemedPortal = createThemedPortal(Primitive.Portal);

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function AlertDialogBackdrop({
  className,
  ...props
}: ComponentProps<typeof Primitive.Backdrop>) {
  return (
    <Primitive.Backdrop
      {...props}
      className={withClassName("rbx-backdrop", className)}
    />
  );
}

function AlertDialogPopup({
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Popup
      {...props}
      className={withClassName("rbx-dialog", className)}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof Primitive.Title>) {
  return (
    <Primitive.Title
      {...props}
      className={withClassName("rbx-dialog-title", className)}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      {...props}
      className={withClassName("rbx-description", className)}
    />
  );
}

function AlertDialogTrigger({
  className,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      {...props}
      className={withClassName("rbx-button", className)}
    />
  );
}

function AlertDialogClose({
  className,
  ...props
}: ComponentProps<typeof Primitive.Close>) {
  return (
    <Primitive.Close
      {...props}
      className={withClassName("rbx-button", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const AlertDialog = {
  ...Primitive,
  Portal: ThemedPortal,
  Backdrop: AlertDialogBackdrop,
  Popup: AlertDialogPopup,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Trigger: AlertDialogTrigger,
  Close: AlertDialogClose,
};
