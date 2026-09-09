"use client";

import type { ComponentProps } from "react";
import { Accordion as Primitive } from "@base-ui/react/accordion";
import { withClassName } from "../../lib/cx";
import { Icon } from "./icon";
import "./accordion.css";

// 동작과 접근성은 Base UI가 담당합니다. 이 파일은 스타일 연결만 담당합니다.
function AccordionRoot({
  multiple = true,
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      multiple={multiple}
      className={withClassName("rbx-accordion", className)}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      {...props}
      className={withClassName("rbx-accordion-item", className)}
    />
  );
}

function AccordionHeader({
  className,
  ...props
}: ComponentProps<typeof Primitive.Header>) {
  return (
    <Primitive.Header
      {...props}
      className={withClassName("rbx-accordion-header", className)}
    />
  );
}

function AccordionTrigger({
  className,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      {...props}
      className={withClassName("rbx-accordion-trigger", className)}
    />
  );
}

function AccordionPanel({
  className,
  ...props
}: ComponentProps<typeof Primitive.Panel>) {
  return (
    <Primitive.Panel
      {...props}
      className={withClassName("rbx-accordion-panel", className)}
    />
  );
}

/** 상태는 Base UI Trigger의 data-panel-open 속성을 따라갑니다. */
function AccordionChevron() {
  return (
    <span className="rbx-accordion-chevron" aria-hidden="true">
      <Icon name="icon-regular-chevron-large-down" size={20} />
      <Icon name="icon-regular-chevron-large-up" size={20} />
    </span>
  );
}
// Root/Portal 등 스타일 없는 파트와 제네릭 API는 원본을 그대로 보존합니다.
export const Accordion = {
  ...Primitive,
  Chevron: AccordionChevron,
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};
