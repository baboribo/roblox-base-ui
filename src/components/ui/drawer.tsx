"use client";

import type { ComponentProps } from "react";
import { Drawer as Primitive } from "@base-ui/react/drawer";
import { withClassName } from "../../lib/cx";
import { createThemedPortal } from "../../lib/create-themed-portal";
import "./drawer.css";

const ThemedPortal = createThemedPortal(Primitive.Portal);

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function DrawerBackdrop({
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

function DrawerPopup({
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Popup
      {...props}
      className={withClassName("rbx-drawer", className)}
    />
  );
}

function DrawerTitle({
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

function DrawerDescription({
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

function DrawerTrigger({
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

function DrawerClose({
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

function DrawerContent({
  className,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Content
      {...props}
      className={withClassName("rbx-drawer-content", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Drawer = {
  ...Primitive,
  Portal: ThemedPortal,
  Backdrop: DrawerBackdrop,
  Popup: DrawerPopup,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Trigger: DrawerTrigger,
  Close: DrawerClose,
  Content: DrawerContent,
};
