"use client";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@base-ui/react/button";
import { cx, withClassName } from "../../lib/cx";
import "./list.css";
export type ListRootProps = ComponentProps<"ul"> & {
  /** 목록 테두리와 구분선입니다. @defaultValue "standard" */
  variant?: "standard" | "boxed" | "inset";
};
function ListRoot({
  variant = "standard",
  className,
  ...props
}: ListRootProps) {
  return (
    <ul
      {...props}
      data-variant={variant}
      className={cx("rbx-list", className)}
    />
  );
}
function ListItem({ className, ...props }: ComponentProps<"li">) {
  return <li {...props} className={cx("rbx-list-item", className)} />;
}
/** 상호작용이 있는 행만 Button을 씁니다. 버튼 안에 다른 버튼을 넣지 마세요. */
function ListAction({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={withClassName("rbx-list-action", className)}
    />
  );
}
export type ListContentProps = ComponentProps<"div"> & {
  /** 내용 앞에 표시할 요소입니다. */
  leading?: ReactNode;
  /** 내용 뒤에 표시할 요소입니다. */
  trailing?: ReactNode;
};
function ListContent({
  leading,
  trailing,
  children,
  className,
  ...props
}: ListContentProps) {
  return (
    <div {...props} className={cx("rbx-list-content", className)}>
      {leading && <span className="rbx-list-leading">{leading}</span>}
      <div className="rbx-list-body">{children}</div>
      {trailing && <span className="rbx-list-trailing">{trailing}</span>}
    </div>
  );
}
function ListTitle({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-list-title", className)} />;
}
function ListDescription({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-list-description", className)} />;
}
export const List = {
  Root: ListRoot,
  Item: ListItem,
  Action: ListAction,
  Content: ListContent,
  Title: ListTitle,
  Description: ListDescription,
};
