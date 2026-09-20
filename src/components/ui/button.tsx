"use client";
import { cloneElement, type ComponentProps, type ReactNode } from "react";
import { useRender } from "@base-ui/react/use-render";
import { Button as Primitive } from "@base-ui/react/button";
import { withClassName } from "../../lib/cx";
import { Spinner } from "./spinner";
import "./button.css";

export type ButtonVariant =
  | "emphasis"
  | "standard"
  | "soft-emphasis"
  | "sub-emphasis"
  | "subtle"
  | "utility"
  | "over-media"
  | "alert"
  | "link";
export type ButtonProps = ComponentProps<typeof Primitive> & {
  /** 처리 중 표시를 켜고 재실행을 막습니다. @defaultValue false */
  loading?: boolean;
  /** 버튼의 색상과 강조 수준입니다. @defaultValue "emphasis" */
  variant?: ButtonVariant;
  /** 버튼 높이입니다. @defaultValue "lg" */
  size?: "xs" | "sm" | "md" | "lg";
};
/** variant는 색상 역할, size는 높이를 고릅니다. 원본 Base UI props/ref도 전달합니다. */
export function Button({
  variant = "emphasis",
  size = "lg",
  loading = false,
  disabled,
  children,
  className,
  render,
  focusableWhenDisabled,
  ...props
}: ButtonProps) {
  return (
    <Primitive
      {...props}
      disabled={disabled || loading}
      focusableWhenDisabled={focusableWhenDisabled ?? loading}
      aria-busy={loading || props["aria-busy"]}
      data-loading={loading || undefined}
      data-variant={variant}
      data-size={size}
      className={withClassName("rbx-button", className)}
      render={(elementProps, state) => (
        <ButtonSurface
          elementProps={elementProps}
          state={state}
          render={render}
          loading={loading}
        />
      )}
    >
      {children}
    </Primitive>
  );
}

/** 합성한 링크의 children·ref도 최종 요소에서 보존하며, 로딩 표시가 버튼 폭을 바꾸지 않게 합니다. */
function ButtonSurface({
  elementProps,
  state,
  render,
  loading,
}: {
  elementProps: ComponentProps<"button">;
  state: Primitive.State;
  render: ButtonProps["render"];
  loading: boolean;
}) {
  const { ref, ...props } = elementProps;
  const element = useRender({
    defaultTagName: "button",
    render,
    ref,
    props,
    state: { ...state },
  });
  const children = (element.props as { children?: ReactNode }).children;
  return cloneElement(
    element,
    {},
    <>
      <span className="rbx-button-label">{children}</span>
      {loading && (
        <span className="rbx-button-loader" aria-hidden="true">
          <Spinner size="sm" aria-hidden="true" />
        </span>
      )}
    </>,
  );
}
