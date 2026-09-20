"use client";

import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

// 원본 팔레트/아이콘 데이터 대신 실제 표면에 쓰는 의미 토큰만 전달합니다.
const inheritedPrefixes = [
  "color-",
  "inverse-",
  "alpha-color-",
  "font-",
  "typography-",
  "focus-",
  "shadow-",
  "layer-",
  "motion-",
  "radius-",
  "padding-",
  "gap-",
  "time-",
  "ease-",
];

/** Portal은 DOM 상속이 끊기므로, 사용하는 토큰만 원래 요소에서 가져옵니다. */
export function usePortalStyle(
  sourceRef: RefObject<HTMLElement | null>,
  active: boolean,
  tokens?: readonly string[],
) {
  const [snapshot, setSnapshot] = useState<{
    theme?: string;
    style: CSSProperties;
  }>({ style: {} });

  useLayoutEffect(() => {
    const source = sourceRef.current;
    if (!active || !source) return;
    const update = () => {
      const computed =
        source.ownerDocument.defaultView!.getComputedStyle(source);
      const theme =
        source
          .closest('[data-theme="light"], [data-theme="dark"]')
          ?.getAttribute("data-theme") ?? undefined;
      const style = {
        colorScheme: computed.colorScheme,
        direction: computed.direction,
        ...Object.fromEntries(
          (
            tokens ??
            Array.from(computed).filter(
              (name) =>
                !name.startsWith("--rbx-color-extended-") &&
                inheritedPrefixes.some((prefix) =>
                  name.startsWith(`--rbx-${prefix}`),
                ),
            )
          ).map((token) => [token, computed.getPropertyValue(token).trim()]),
        ),
      } as CSSProperties;
      setSnapshot((previous) =>
        previous.theme === theme &&
        JSON.stringify(previous.style) === JSON.stringify(style)
          ? previous
          : { theme, style },
      );
    };
    update();
    // 열린 중간에 테마·클래스·사용자 토큰이 바뀌어도 함께 갱신합니다.
    const observer = new MutationObserver(update);
    for (
      let node: HTMLElement | null = source;
      node;
      node = node.parentElement
    ) {
      observer.observe(node, {
        attributes: true,
        attributeFilter: ["data-theme", "data-contrast", "class", "style"],
      });
    }
    const view = source.ownerDocument.defaultView;
    const scheme = view?.matchMedia("(prefers-color-scheme: dark)");
    view?.addEventListener("resize", update);
    scheme?.addEventListener("change", update);
    return () => {
      observer.disconnect();
      view?.removeEventListener("resize", update);
      scheme?.removeEventListener("change", update);
    };
  }, [sourceRef, active, tokens]);

  return snapshot;
}
