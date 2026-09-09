"use client";

import type { ComponentProps } from "react";
import { NavigationMenu as Primitive } from "@base-ui/react/navigation-menu";
import { withClassName } from "../../lib/cx";
import "./navigation-menu.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function NavigationMenuRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-navigation-menu", className)}
    />
  );
}

function NavigationMenuList({
  className,
  ...props
}: ComponentProps<typeof Primitive.List>) {
  return (
    <Primitive.List
      {...props}
      className={withClassName("rbx-nav-list", className)}
    />
  );
}

function NavigationMenuTrigger({
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

function NavigationMenuLink({
  className,
  ...props
}: ComponentProps<typeof Primitive.Link>) {
  return (
    <Primitive.Link
      {...props}
      className={withClassName("rbx-nav-link", className)}
    />
  );
}

function NavigationMenuContent({
  className,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Content
      {...props}
      className={withClassName("rbx-nav-content", className)}
    />
  );
}

function NavigationMenuPopup({
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Popup
      {...props}
      className={withClassName("rbx-popup", className)}
    />
  );
}

function NavigationMenuPositioner({
  className,
  ...props
}: ComponentProps<typeof Primitive.Positioner>) {
  return (
    <Primitive.Positioner
      {...props}
      className={withClassName("rbx-positioner", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const NavigationMenu = {
  ...Primitive,
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Trigger: NavigationMenuTrigger,
  Link: NavigationMenuLink,
  Content: NavigationMenuContent,
  Popup: NavigationMenuPopup,
  Positioner: NavigationMenuPositioner,
};
