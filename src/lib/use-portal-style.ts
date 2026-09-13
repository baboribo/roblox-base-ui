"use client";

import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

/** Portal은 DOM 상속이 끊기므로, 사용하는 토큰만 원래 요소에서 가져옵니다. */
export function usePortalStyle(
  sourceRef: RefObject<HTMLElement | null>,
  active: boolean,
  tokens: readonly string[],
) {
  const [snapshot, setSnapshot] = useState<{
    theme?: string;
    style: CSSProperties;
  }>({ style: {} });

  useLayoutEffect(() => {
    const source = sourceRef.current;
    if (!active || !source) return;
    const update = () => {
      const computed = getComputedStyle(source);
      const theme =
        source
          .closest('[data-theme="light"], [data-theme="dark"]')
          ?.getAttribute("data-theme") ?? undefined;
      const style = {
        colorScheme: computed.colorScheme,
        ...Object.fromEntries(
          tokens.map((token) => [
            token,
            computed.getPropertyValue(token).trim(),
          ]),
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
    return () => observer.disconnect();
  }, [sourceRef, active, tokens]);

  return snapshot;
}
