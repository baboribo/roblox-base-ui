"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentProps,
} from "react";
import { useMergedRef } from "../../lib/use-merged-ref";
import { cx } from "../../lib/cx";
import { paginationItems } from "../../lib/pagination";
import { Button } from "./button";
import { Icon } from "./icon";
import "./pagination.css";

export type PaginationProps = Omit<ComponentProps<"nav">, "children"> & {
  /** 전체 페이지 수입니다. 0이면 페이지 이동 UI를 표시하지 않습니다. */
  pageCount: number;
  /** 현재 페이지입니다. 1부터 시작합니다. */
  page?: number;
  /** 비제어 방식의 시작 페이지입니다. @defaultValue 1 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** 데이터를 불러오는 동안 이동을 막을 때 사용합니다. @defaultValue false */
  disabled?: boolean;
  /** 페이지 버튼의 접근 가능한 이름입니다. */
  getPageLabel?: (page: number) => string;
};

/** 페이지 선택만 담당합니다. 데이터 요청과 URL 갱신은 onPageChange에서 처리합니다. */
export function Pagination({
  pageCount,
  page,
  defaultPage = 1,
  onPageChange,
  disabled = false,
  getPageLabel = (value) => `${value}페이지`,
  className,
  ref,
  ...props
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const root = useRef<HTMLElement>(null);
  const mergedRef = useMergedRef(root, ref);
  const [compact, setCompact] = useState(false);
  const restoreFocus = useRef(false);
  const lastCorrection = useRef<string | null>(null);
  const count = Number.isFinite(pageCount)
    ? Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(pageCount)))
    : 0;
  const value = page ?? internalPage;
  const current = Number.isFinite(value)
    ? Math.max(1, Math.min(count, Math.floor(value)))
    : 1;
  const items = paginationItems(current, count);
  // 화면 너비가 아니라 이 탐색 영역에 실제로 주어진 공간을 기준으로 바꿉니다.
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const update = () => {
      const button = element.querySelector("button");
      if (!button) return;
      const style = getComputedStyle(button);
      const canvas = element.ownerDocument
        .createElement("canvas")
        .getContext("2d");
      if (canvas) canvas.font = style.font;
      const inset =
        parseFloat(style.paddingLeft) +
        parseFloat(style.paddingRight) +
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.borderRightWidth);
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      const required =
        2 * button.getBoundingClientRect().width +
        gap * (items.length + 1) +
        items.reduce<number>(
          (sum, item) =>
            sum +
            Math.max(
              32,
              (canvas?.measureText(
                String(typeof item === "number" ? item : "…"),
              ).width ?? 16) + inset,
            ),
          0,
        );
      const next = element.clientWidth < required;
      const focused = element.ownerDocument.activeElement;
      const willRemoveFocus = next
        ? focused?.hasAttribute("data-page-number")
        : focused?.matches(".rbx-pagination-summary input");
      if (
        next !== element.hasAttribute("data-compact") &&
        willRemoveFocus &&
        element.contains(focused)
      )
        restoreFocus.current = true;
      setCompact(next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.ownerDocument.fonts.addEventListener("loadingdone", update);
    return () => {
      observer.disconnect();
      element.ownerDocument.fonts.removeEventListener("loadingdone", update);
    };
  }, [current, count]);
  useLayoutEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    root.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
  }, [compact]);
  // 필터 변경으로 범위를 벗어나면 UI와 내부 상태·호출자의 데이터가 같은 페이지를 가리키게 합니다.
  useEffect(() => {
    if (!count || value === current) {
      lastCorrection.current = null;
      return;
    }
    const correction = String(value) + ":" + current;
    if (lastCorrection.current === correction) return;
    lastCorrection.current = correction;
    if (page === undefined) setInternalPage(current);
    onPageChange?.(current);
  }, [count, value, current, page, onPageChange]);
  function select(next: number) {
    if (disabled || next === current || next < 1 || next > count) return;
    if (page === undefined) setInternalPage(next);
    onPageChange?.(next);
  }
  if (count === 0) return null;
  return (
    <nav
      aria-label="페이지 이동"
      ref={mergedRef}
      data-compact={compact || undefined}
      {...props}
      className={cx("rbx-pagination", className)}
    >
      <Button
        size="sm"
        variant="utility"
        aria-label="이전 페이지"
        disabled={disabled || current === 1}
        onClick={() => select(current - 1)}
      >
        <Icon name="icon-regular-chevron-large-left" size={16} />
      </Button>
      {!compact &&
        items.map((item) =>
          typeof item === "number" ? (
            <Button
              key={item}
              data-page-number={item}
              size="sm"
              variant={item === current ? "standard" : "utility"}
              aria-label={getPageLabel(item)}
              aria-current={item === current ? "page" : undefined}
              disabled={disabled}
              onClick={() => select(item)}
            >
              {item}
            </Button>
          ) : (
            <span key={item} className="rbx-pagination-gap" aria-hidden="true">
              …
            </span>
          ),
        )}
      {compact && (
        <PageInput
          page={current}
          count={count}
          disabled={disabled}
          onCommit={select}
        />
      )}
      <Button
        size="sm"
        variant="utility"
        aria-label="다음 페이지"
        disabled={disabled || current === count}
        onClick={() => select(current + 1)}
      >
        <Icon name="icon-regular-chevron-large-right" size={16} />
      </Button>
    </nav>
  );
}

/** 좁은 화면에서도 여러 페이지를 한 번에 이동할 수 있게 직접 입력을 유지합니다. */
function PageInput({
  page,
  count,
  disabled,
  onCommit,
}: {
  page: number;
  count: number;
  disabled: boolean;
  onCommit: (page: number) => void;
}) {
  const [draft, setDraft] = useState(String(page));
  useEffect(() => {
    setDraft(String(page));
  }, [page, count]);
  const commit = () => {
    const number = Number(draft);
    if (draft.trim() && Number.isFinite(number))
      onCommit(Math.max(1, Math.min(count, Math.floor(number))));
    setDraft(String(page));
  };
  return (
    <span className="rbx-pagination-summary">
      <input
        aria-label="이동할 페이지"
        aria-current="page"
        inputMode="numeric"
        value={draft}
        disabled={disabled}
        style={{ width: Math.min(String(count).length + 1, 8) + "ch" }}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          } else if (event.key === "Escape") {
            setDraft(String(page));
            event.stopPropagation();
          }
        }}
      />
      <span> / {count}</span>
    </span>
  );
}
