"use client";

import { useRef, type ComponentProps, type ComponentType } from "react";
import type { Dialog } from "@base-ui/react/dialog";
import { usePortalStyle } from "./use-portal-style";

type PortalProps = ComponentProps<typeof Dialog.Portal>;

/** 원래 위치의 테마를 유지하며 Base UI의 Portal·ref·render API를 보존합니다. */
export function createThemedPortal<Props extends PortalProps>(
  Portal: ComponentType<Props>,
) {
  function ThemedPortal(props: Props) {
    const sourceRef = useRef<HTMLTemplateElement>(null);
    const inherited = usePortalStyle(sourceRef, true);
    const { style } = props;
    // 팝업 안에 래퍼를 추가하지 않고 Portal 자체에 토큰을 전달합니다.
    const merged = {
      "data-theme": inherited.theme,
      ...props,
      style:
        typeof style === "function"
          ? (state: {}) => ({ ...inherited.style, ...style(state) })
          : { ...inherited.style, ...style },
    } as Props;
    return (
      <>
        <template ref={sourceRef} />
        <Portal {...merged} />
      </>
    );
  }
  return ThemedPortal;
}
