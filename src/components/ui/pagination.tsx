"use client";

import { useState, type ComponentProps } from "react";
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
  ...props
}: PaginationProps) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const count = Number.isFinite(pageCount)
    ? Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(pageCount)))
    : 0;
  const value = page ?? internalPage;
  const current = Number.isFinite(value)
    ? Math.max(1, Math.min(count, Math.floor(value)))
    : 1;
  function select(next: number) {
    if (disabled || next === current || next < 1 || next > count) return;
    if (page === undefined) setInternalPage(next);
    onPageChange?.(next);
  }
  if (count === 0) return null;
  return (
    <nav
      aria-label="페이지 이동"
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
      {paginationItems(current, count).map((item) =>
        typeof item === "number" ? (
          <Button
            key={item}
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
