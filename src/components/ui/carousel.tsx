"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { Button } from "@base-ui/react/button";
import { IconButton } from "./icon-button";
import { cx } from "../../lib/cx";
import "./carousel.css";
export type CollectionItem = {
  id: string;
  title: string;
  description?: string;
  media: ReactNode;
};
/** Base UI ScrollArea + Button 조합. 카드의 280/160/12px 규칙은 Account Status에서 측정했습니다. */
export function Carousel({
  label,
  items,
  onItemClick,
  previousLabel = "이전 카드",
  nextLabel = "다음 카드",
  className,
}: {
  /** 캐러셀 영역의 접근 가능한 이름입니다. */
  label: string;
  items: CollectionItem[];
  onItemClick?: (id: string) => void;
  /** 이전 카드로 이동하는 버튼의 이름입니다. @defaultValue "이전 카드" */
  previousLabel?: string;
  /** 다음 카드로 이동하는 버튼의 이름입니다. @defaultValue "다음 카드" */
  nextLabel?: string;
  className?: string;
}) {
  // Informational cards must not advertise an action that does not exist.
  const Item = onItemClick ? Button : "div";
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  function updateEdges() {
    const el = viewport.current;
    if (el)
      setEdges({
        start: Math.abs(el.scrollLeft) < 1,
        end: Math.abs(el.scrollLeft) + el.clientWidth >= el.scrollWidth - 1,
      });
  }
  useEffect(() => {
    const observer = new ResizeObserver(updateEdges);
    if (viewport.current) observer.observe(viewport.current);
    if (content.current) observer.observe(content.current);
    updateEdges();
    return () => observer.disconnect();
  }, [items.length]);
  function scroll(direction: number) {
    const el = viewport.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const card = content.current?.firstElementChild;
    const gap = content.current
      ? parseFloat(getComputedStyle(content.current).columnGap) || 0
      : 0;
    const distance =
      (card?.getBoundingClientRect().width ?? el.clientWidth) + gap;
    el.scrollBy({
      left: direction * (rtl ? -distance : distance),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section
      className={cx("rbx-carousel", className)}
      aria-label={label}
      aria-roledescription="carousel"
    >
      <ScrollArea.Root>
        <ScrollArea.Viewport
          className="rbx-carousel-viewport"
          ref={viewport}
          onScroll={updateEdges}
        >
          <ScrollArea.Content className="rbx-carousel-content" ref={content}>
            {items.map((item) => (
              <Item
                key={item.id}
                className="rbx-carousel-item"
                onClick={onItemClick ? () => onItemClick(item.id) : undefined}
              >
                <span className="rbx-carousel-media">{item.media}</span>
                <span className="rbx-carousel-copy">
                  <span className="rbx-carousel-title">{item.title}</span>
                  {item.description && (
                    <span className="rbx-carousel-description">
                      {item.description}
                    </span>
                  )}
                </span>
              </Item>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
      <div className="rbx-carousel-controls">
        <IconButton
          icon="icon-regular-chevron-large-left"
          aria-label={previousLabel}
          size="sm"
          variant="utility"
          circular
          // 끝에 도달해도 키보드 포커스가 body로 사라지지 않게 합니다.
          focusableWhenDisabled
          disabled={edges.start}
          onClick={() => scroll(-1)}
        />
        <IconButton
          icon="icon-regular-chevron-large-right"
          aria-label={nextLabel}
          size="sm"
          variant="utility"
          circular
          focusableWhenDisabled
          disabled={edges.end}
          onClick={() => scroll(1)}
        />
      </div>
    </section>
  );
}
