"use client";

import { useRef, useLayoutEffect, type ComponentProps } from "react";
import { useMergedRef } from "../../lib/use-merged-ref";
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
  ref,
  ...props
}: ComponentProps<typeof Primitive.List>) {
  const local = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(local, ref);
  useLayoutEffect(() => {
    const list = local.current;
    if (!list) return;
    // 외부 상태나 URL로 선택이 바뀌어도 선택된 탭을 스크롤 영역 안에 둡니다.
    const reveal = () => {
      const active = list.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]',
      );
      if (!active) return;
      const box = active.getBoundingClientRect(),
        viewport = list.getBoundingClientRect();
      if (list.dataset.orientation === "vertical") {
        if (box.top < viewport.top) list.scrollTop += box.top - viewport.top;
        else if (box.bottom > viewport.bottom)
          list.scrollTop += box.bottom - viewport.bottom;
      } else {
        if (box.left < viewport.left)
          list.scrollLeft += box.left - viewport.left;
        else if (box.right > viewport.right)
          list.scrollLeft += box.right - viewport.right;
      }
    };
    reveal();
    const mutations = new MutationObserver(reveal);
    mutations.observe(list, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-selected", "data-orientation"],
    });
    const resize = new ResizeObserver(reveal);
    resize.observe(list);
    list.ownerDocument.fonts.addEventListener("loadingdone", reveal);
    return () => {
      mutations.disconnect();
      resize.disconnect();
      list.ownerDocument.fonts.removeEventListener("loadingdone", reveal);
    };
  }, []);
  return (
    <Primitive.List
      {...props}
      ref={mergedRef}
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

// 두 패널을 같은 칸에 두어 퇴장 중에도 내용 영역을 유지합니다.
function TabsPanels({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={["rbx-tab-panels", className].filter(Boolean).join(" ")}
    />
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
  Panels: TabsPanels,
  Panel: TabsPanel,
  Indicator: TabsIndicator,
};
