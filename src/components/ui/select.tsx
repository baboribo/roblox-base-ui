"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Select as Primitive } from "@base-ui/react/select";
import { Badge } from "./badge";
import { Icon } from "./icon";
import { cx } from "../../lib/cx";
import { usePortalStyle } from "../../lib/use-portal-style";
import "./select.css";

// Select와 요약 Badge가 사용하는 값만 복사합니다. 전체 토큰/아이콘은 복사하지 않습니다.
const portalTokens = [
  "--rbx-color-surface-200",
  "--rbx-color-content-emphasis",
  "--rbx-color-stroke-contrast-alpha",
  "--rbx-color-stroke-default",
  "--rbx-color-system-alert",
  "--rbx-color-state-hover",
  "--rbx-color-shift-200",
  "--rbx-focus-ring",
  "--rbx-shadow-transient-low",
  "--rbx-alpha-color-shadow-subtle",
  "--rbx-font-body",
  "--rbx-typography-body-large-font",
  "--rbx-typography-body-medium-font",
  "--rbx-typography-body-small-font",
  "--rbx-typography-label-small-font",
  "--rbx-motion-duration-panel",
  "--rbx-motion-duration-panel-exit",
  "--rbx-motion-ease-enter",
  "--rbx-motion-ease-exit",
  "--rbx-time-100",
  "--rbx-layer-popup",
] as const;

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};
export type SelectProps<Multiple extends boolean = false> = Omit<
  Primitive.Root.Props<string, Multiple>,
  "children" | "items" | "actionsRef" | "modal" | "highlightItemOnHover"
> & {
  options: readonly SelectOption[];
  label: string;
  placeholder?: string;
  /** 버튼과 목록의 크기입니다. @defaultValue "lg" */
  size?: "sm" | "md" | "lg";
  description?: string;
  error?: string;
  invalid?: boolean;
  className?: string;
  /** 기본값은 화면 경계입니다. 제한된 편집 영역에서는 별도 경계를 지정할 수 있습니다. */
  collisionBoundary?: Primitive.Positioner.Props["collisionBoundary"];
  /** 모션 비교용 배속입니다. 기본값은 1입니다. */
  motionScale?: number;
};

/** Base UI의 값·폼·키보드 처리를 사용하는 연결형 Select입니다. */
export function Select<Multiple extends boolean = false>({
  options,
  label,
  placeholder = "선택하세요",
  size = "lg",
  description,
  error,
  invalid,
  className,
  collisionBoundary,
  motionScale = 1,
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onOpenChangeComplete,
  disabled = false,
  readOnly = false,
  multiple,
  id: suppliedId,
  ...rootProps
}: SelectProps<Multiple>) {
  const autoId = useId();
  const id = suppliedId ?? autoId;
  type Value = Primitive.Root.Props<string, Multiple>["value"];
  const [internalValue, setInternalValue] = useState<Value>(
    defaultValue ?? ((multiple ? [] : null) as Value),
  );
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = !disabled && (controlledOpen ?? internalOpen);
  const [hiddenValue, setHiddenValue] = useState(value);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<HTMLDivElement | null>(null);
  const portalStyle = usePortalStyle(triggerRef, open || !!popup, portalTokens);
  const [headerHeight, setHeaderHeight] = useState(
    { sm: 32, md: 40, lg: 48 }[size],
  );
  const [edges, setEdges] = useState({ up: 0, down: 0 });
  const [contentHeight, setContentHeight] = useState(240);
  const [pointer, setPointer] = useState(false);
  const pendingKeyboard = useRef(false);
  const values = (
    multiple
      ? Array.isArray(value)
        ? value
        : []
      : value == null
        ? []
        : [value]
  ) as string[];
  const labels = values.map(
    (entry) => options.find((option) => option.value === entry)?.label ?? entry,
  );
  const summaryLabel = labels.length
    ? labels.slice(0, 2).join(", ") +
      (labels.length > 2 ? ` 외 ${labels.length - 2}개` : "")
    : placeholder;

  function measureEdges() {
    const node = scrollRef.current;
    if (!node) return;
    // Base UI가 닫힌 목록을 숨겨 보관할 때의 0px 측정은 버립니다.
    // 마지막 전체 높이를 유지해야 다시 열 때 방향이 바뀌지 않습니다.
    if (node.scrollHeight > 0) setContentHeight(node.scrollHeight);
    const max = Math.max(0, node.scrollHeight - node.clientHeight);
    const position = Math.max(0, Math.min(max, node.scrollTop));
    const strength = (distance: number) => {
      if (distance <= 0.5 || max <= 1) return 0;
      const x = Math.min(1, distance / 48);
      return x * x * (3 - 2 * x);
    };
    const next = { up: strength(position), down: strength(max - position) };
    setEdges((old) =>
      old.up === next.up && old.down === next.down ? old : next,
    );
  }
  function revealFocused(element: HTMLElement) {
    const scroll = scrollRef.current;
    if (!scroll || element.hidden) return;
    const item = element.getBoundingClientRect();
    const box = scroll.getBoundingClientRect();
    const margin = Math.min(32, Math.max(0, (box.height - item.height) / 2));
    if (item.top < box.top + margin)
      scroll.scrollTop += item.top - box.top - margin;
    else if (item.bottom > box.bottom - margin)
      scroll.scrollTop += item.bottom - box.bottom + margin;
  }
  function scrollBy(direction: number) {
    const node = scrollRef.current;
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollBy({
      top: node.clientHeight * direction * 0.65,
      behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  useLayoutEffect(() => {
    // 외부에서 open/value를 바꿔도 현재 값은 목록에서 숨깁니다.
    // 닫히는 동안에는 이전 목록을 유지해 퇴장 모션이 흔들리지 않게 합니다.
    if (open) setHiddenValue(value);
  }, [open, value]);
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const measure = () => setHeaderHeight(trigger.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [size]);
  useLayoutEffect(() => {
    if (!open || !popup) return;
    const scroll = scrollRef.current;
    if (!scroll) return;
    measureEdges();
    const observer = new ResizeObserver(measureEdges);
    observer.observe(scroll);
    if (scroll.firstElementChild) observer.observe(scroll.firstElementChild);
    const frame = requestAnimationFrame(() => {
      const focused = document.activeElement;
      // 숨긴 현재 값에 초기 포커스를 시도한 경우에만 보완합니다.
      if (
        !multiple &&
        pendingKeyboard.current &&
        !(
          focused instanceof HTMLElement &&
          focused.matches(".rbx-attached-option:not([hidden])")
        )
      ) {
        scroll
          .querySelector<HTMLElement>(
            ".rbx-attached-option:not([hidden]):not([data-disabled])",
          )
          ?.focus({ preventScroll: true });
      }
      pendingKeyboard.current = false;
    });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [open, popup, multiple]);
  useEffect(() => {
    const trigger = triggerRef.current;
    const form = rootProps.form
      ? document.getElementById(rootProps.form)
      : trigger?.closest("form");
    if (!(form instanceof HTMLFormElement)) return;
    const reset = (event: Event) =>
      queueMicrotask(() => {
        if (event.defaultPrevented) return;
        if (controlledValue === undefined)
          setInternalValue(defaultValue ?? ((multiple ? [] : null) as Value));
        if (controlledOpen === undefined) setInternalOpen(false);
      });
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [controlledValue, controlledOpen, defaultValue, multiple, rootProps.form]);

  const summary = (
    <span className="rbx-attached-summary" aria-label={summaryLabel}>
      <span className="rbx-attached-names">
        {labels.length ? (
          labels.slice(0, 2).map((text, index) => (
            <span key={`${index}-${text}`} className="rbx-attached-name-entry">
              <span className="rbx-attached-name" title={text}>
                {text}
              </span>
              {index < Math.min(2, labels.length) - 1 && <span>,</span>}
            </span>
          ))
        ) : (
          <span className="rbx-attached-name">{placeholder}</span>
        )}
      </span>
      {labels.length > 2 && (
        <Badge size="sm" className="rbx-attached-count">
          외 {labels.length - 2}개
        </Badge>
      )}
    </span>
  );
  const motion = {
    "--attached-header": `${headerHeight}px`,
    "--attached-content": `${contentHeight}px`,
    "--attached-speed": motionScale,
  } as CSSProperties;
  const describedBy =
    [description && `${id}-description`, error && `${id}-error`]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cx("rbx-attached-field", className)}>
      <label id={`${id}-label`} htmlFor={id} className="rbx-attached-label">
        {label}
        {rootProps.required && <span aria-hidden="true"> *</span>}
      </label>
      <Primitive.Root<string, Multiple>
        {...rootProps}
        id={id}
        items={options}
        multiple={multiple}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        open={open}
        modal={false}
        highlightItemOnHover={false}
        onValueChange={(next, details) => {
          onValueChange?.(next, details);
          if (!details.isCanceled && controlledValue === undefined)
            setInternalValue(next as Value);
        }}
        onOpenChange={(next, details) => {
          onOpenChange?.(next, details);
          if (details.isCanceled) return;
          if (next) {
            setHiddenValue(value);
            pendingKeyboard.current = details.event.type.startsWith("key");
            setPointer(false);
          }
          if (controlledOpen === undefined) setInternalOpen(next);
        }}
        onOpenChangeComplete={onOpenChangeComplete}
      >
        <Primitive.Trigger
          ref={triggerRef}
          className="rbx-attached-trigger"
          data-size={size}
          data-multiple={multiple ? "" : undefined}
          aria-labelledby={`${id}-label ${id}-value`}
          aria-describedby={describedBy}
          aria-invalid={invalid || !!error || undefined}
        >
          <Primitive.Value id={`${id}-value`}>{summary}</Primitive.Value>
          <Icon name="icon-regular-chevron-large-down" size={16} />
        </Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Positioner
            alignItemWithTrigger={false}
            side="bottom"
            align="start"
            sideOffset={-headerHeight}
            collisionPadding={8}
            collisionBoundary={collisionBoundary}
            collisionAvoidance={{
              side: "flip",
              align: "shift",
              fallbackAxisSide: "none",
            }}
            positionMethod="fixed"
            className="rbx-attached-positioner"
            data-theme={portalStyle.theme}
            style={{ ...portalStyle.style, ...motion }}
          >
            <Primitive.Popup
              ref={setPopup}
              finalFocus={triggerRef}
              className="rbx-attached-popup"
              data-invalid={invalid || !!error ? "" : undefined}
              data-size={size}
              data-multiple={multiple ? "" : undefined}
              data-pointer={pointer ? "" : undefined}
              onPointerMoveCapture={() => setPointer(true)}
              onPointerDownCapture={() => setPointer(true)}
              onKeyDownCapture={() => setPointer(false)}
            >
              <div className="rbx-attached-header" aria-hidden="true">
                {summary}
                <Icon name="icon-regular-chevron-large-down" size={16} />
              </div>
              <div className="rbx-attached-reveal">
                <div className="rbx-attached-clip">
                  <div
                    className="rbx-attached-list-shell"
                    style={
                      {
                        "--attached-up": edges.up,
                        "--attached-down": edges.down,
                      } as CSSProperties
                    }
                  >
                    <Primitive.List
                      ref={scrollRef}
                      className="rbx-attached-list"
                      tabIndex={-1}
                      aria-labelledby={`${id}-label`}
                      onScroll={measureEdges}
                    >
                      <div>
                        {options.map((option) => (
                          <Primitive.Item
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            disabled={option.disabled}
                            hidden={!multiple && hiddenValue === option.value}
                            className="rbx-attached-option"
                            onFocus={(event) => {
                              if (event.currentTarget.matches(":focus-visible"))
                                revealFocused(event.currentTarget);
                            }}
                          >
                            <Primitive.ItemText className="rbx-attached-option-text">
                              {option.label}
                            </Primitive.ItemText>
                            {multiple && (
                              <span className="rbx-attached-check">
                                <Primitive.ItemIndicator>
                                  <Icon name="icon-filled-check" size={20} />
                                </Primitive.ItemIndicator>
                              </span>
                            )}
                          </Primitive.Item>
                        ))}
                      </div>
                    </Primitive.List>
                    <button
                      type="button"
                      className="rbx-attached-edge"
                      data-edge="up"
                      aria-hidden={edges.up === 0}
                      disabled={edges.up === 0}
                      tabIndex={-1}
                      aria-label="목록 위로 스크롤"
                      onClick={() => scrollBy(-1)}
                    >
                      <Icon name="icon-regular-chevron-large-up" size={16} />
                    </button>
                    <button
                      type="button"
                      className="rbx-attached-edge"
                      data-edge="down"
                      aria-hidden={edges.down === 0}
                      disabled={edges.down === 0}
                      tabIndex={-1}
                      aria-label="목록 아래로 스크롤"
                      onClick={() => scrollBy(1)}
                    >
                      <Icon name="icon-regular-chevron-large-down" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Primitive.Popup>
          </Primitive.Positioner>
        </Primitive.Portal>
      </Primitive.Root>
      {description && (
        <p id={`${id}-description`} className="rbx-attached-description">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="rbx-attached-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
