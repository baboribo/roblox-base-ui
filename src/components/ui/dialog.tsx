"use client";

import type { ComponentProps } from "react";
import { Dialog as Primitive } from "@base-ui/react/dialog";
import { cx, withClassName } from "../../lib/cx";
import { Icon } from "./icon";
import "./dialog.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function DialogBackdrop({
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

export type DialogPopupProps = ComponentProps<typeof Primitive.Popup> & {
  /** 대화상자 너비입니다. @defaultValue "md" */
  size?: "sm" | "md" | "lg";
};
function DialogPopup({ size = "md", className, ...props }: DialogPopupProps) {
  return (
    <Primitive.Popup
      {...props}
      data-size={size}
      className={withClassName("rbx-dialog", className)}
    />
  );
}

function DialogTitle({
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

function DialogDescription({
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

function DialogTrigger({
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

function DialogClose({
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

function DialogCloseAffordance({
  className,
  ...props
}: ComponentProps<typeof Primitive.Close>) {
  return (
    <Primitive.Close
      aria-label="Close"
      {...props}
      className={withClassName("rbx-dialog-close-affordance", className)}
    >
      <Icon name="icon-regular-x" size={20} />
    </Primitive.Close>
  );
}
/** Body와 Footer를 사용하면 Popup이 여백을 중복해서 만들지 않습니다. */
function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-dialog-body", className)} />;
}
function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-dialog-footer", className)} />;
}
// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Dialog = {
  ...Primitive,
  Body: DialogBody,
  CloseAffordance: DialogCloseAffordance,
  Footer: DialogFooter,
  Backdrop: DialogBackdrop,
  Popup: DialogPopup,
  Title: DialogTitle,
  Description: DialogDescription,
  Trigger: DialogTrigger,
  Close: DialogClose,
};
