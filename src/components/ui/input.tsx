"use client";
import { hasContent } from "../../lib/content";
import { cx } from "../../lib/cx";
import { useRender } from "@base-ui/react/use-render";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Input as Primitive } from "@base-ui/react/input";
import "./input.css";

export type InputProps = ComponentProps<typeof Primitive> & {
  /** 컨트롤 높이입니다. @defaultValue "lg" */
  controlSize?: "xs" | "sm" | "md" | "lg";
  /** 입력 표면의 배경과 테두리입니다. */
  variant?: "standard" | "contrast" | "utility";
  /** 입력 앞의 아이콘 또는 내용입니다. */
  leading?: ReactNode;
  /** 입력 뒤의 아이콘 또는 내용입니다. */
  trailing?: ReactNode;
  /** 장식 유무와 관계없이 네이티브 input에만 적용합니다. */
  inputClassName?: string;
  inputStyle?: CSSProperties;
};
/** className/style은 보이는 전체 표면, ref·이벤트·입력 속성은 실제 input에 연결합니다. */
export function Input({
  controlSize = "lg",
  variant = "standard",
  leading,
  trailing,
  className,
  style,
  inputClassName,
  inputStyle,
  render,
  ...props
}: InputProps) {
  return (
    <Primitive
      {...props}
      render={(elementProps, state) => (
        <InputSurface
          elementProps={elementProps}
          state={state}
          render={render}
          controlSize={controlSize}
          variant={variant}
          leading={leading}
          trailing={trailing}
          className={className}
          style={style}
          inputClassName={inputClassName}
          inputStyle={inputStyle}
        />
      )}
    />
  );
}
function InputSurface({
  elementProps,
  state,
  render,
  controlSize,
  variant,
  leading,
  trailing,
  className,
  style,
  inputClassName,
  inputStyle,
}: Pick<
  InputProps,
  | "render"
  | "controlSize"
  | "variant"
  | "leading"
  | "trailing"
  | "className"
  | "style"
  | "inputClassName"
  | "inputStyle"
> & { elementProps: ComponentProps<"input">; state: Primitive.State }) {
  const grouped = hasContent(leading) || hasContent(trailing);
  const custom = typeof className === "function" ? className(state) : className;
  const resolvedStyle = typeof style === "function" ? style(state) : style;
  const { ref, ...props } = elementProps;
  const invalid =
    state.valid === false ||
    props["aria-invalid"] === true ||
    props["aria-invalid"] === "true";
  const input = useRender({
    defaultTagName: "input",
    render,
    ref,
    state: { ...state },
    props: {
      ...props,
      "data-size": controlSize,
      "data-variant": variant,
      className: cx(
        "rbx-input",
        props.className,
        !grouped && custom,
        inputClassName,
      ),
      style: {
        ...props.style,
        ...(!grouped ? resolvedStyle : undefined),
        ...inputStyle,
      },
    },
  });
  if (!grouped) return input;
  return (
    <div
      className={cx("rbx-input-group", custom)}
      style={resolvedStyle}
      data-size={controlSize}
      data-variant={variant}
      data-disabled={state.disabled || undefined}
      data-invalid={invalid || undefined}
    >
      {hasContent(leading) && (
        <span className="rbx-input-adornment">{leading}</span>
      )}
      {input}
      {hasContent(trailing) && (
        <span className="rbx-input-adornment">{trailing}</span>
      )}
    </div>
  );
}
