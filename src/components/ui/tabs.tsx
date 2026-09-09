"use client";

import type { ComponentProps } from "react";
import { Tabs as Primitive } from "@base-ui/react/tabs";
import { withClassName } from "../../lib/cx";
import "./tabs.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function TabsRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-tabs", className)}
    />
  );
}

function TabsList({
  className,
  ...props
}: ComponentProps<typeof Primitive.List>) {
  return (
    <Primitive.List
      {...props}
      className={withClassName("rbx-tabs-list", className)}
    />
  );
}

function TabsTab({
  className,
  ...props
}: ComponentProps<typeof Primitive.Tab>) {
  return (
    <Primitive.Tab {...props} className={withClassName("rbx-tab", className)} />
  );
}

function TabsPanel({
  className,
  ...props
}: ComponentProps<typeof Primitive.Panel>) {
  return (
    <Primitive.Panel
      {...props}
      className={withClassName("rbx-tab-panel", className)}
    />
  );
}

function TabsIndicator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Indicator>) {
  return (
    <Primitive.Indicator
      {...props}
      className={withClassName("rbx-tab-indicator", className)}
    />
  );
}

// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Tabs = {
  ...Primitive,
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
  Indicator: TabsIndicator,
};
