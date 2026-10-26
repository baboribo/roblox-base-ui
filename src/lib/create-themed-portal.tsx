"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
} from "react";
import type { Dialog } from "@base-ui/react/dialog";
import { usePortalStyle } from "./use-portal-style";

type PortalProps = ComponentProps<typeof Dialog.Portal>;

/** Base UI Portal은 닫히면 children을 렌더하지 않습니다. 실제로 열린 동안만 알립니다. */
function PortalMounted({ onChange }: { onChange: (mounted: boolean) => void }) {
  useLayoutEffect(() => {
    onChange(true);
    return () => onChange(false);
  }, [onChange]);
  return null;
}

/** 원래 위치의 테마를 유지하며 Base UI의 Portal·ref·render API를 보존합니다. */
export function createThemedPortal<Props extends PortalProps>(
  Portal: ComponentType<Props>,
) {
  function ThemedPortal(props: Props) {
    const sourceRef = useRef<HTMLTemplateElement>(null);
    // 닫힌 Tooltip·Menu마다 전체 토큰을 읽고 관찰하지 않도록 열린 동안만 동기화합니다.
    const [mounted, setMounted] = useState(false);
    const inherited = usePortalStyle(sourceRef, mounted);
    const { style } = props;
    const attributes = props as Props & {
      "data-theme"?: string;
      "data-contrast"?: string;
    };
    // 팝업 안에 래퍼를 추가하지 않고 Portal 자체에 토큰을 전달합니다.
    const merged = {
      "data-theme": inherited.theme,
      ...props,
      style:
        typeof style === "function"
          ? (state: {}) => ({ ...inherited.style, ...style(state) })
          : { ...inherited.style, ...style },
      children: (
        <>
          {props.children}
          <PortalMounted onChange={setMounted} />
        </>
      ),
    } as Props;
    return (
      <>
        <template
          ref={sourceRef}
          data-theme={attributes["data-theme"]}
          data-contrast={attributes["data-contrast"]}
          dir={props.dir}
        />
        <Portal {...merged} />
      </>
    );
  }
  return ThemedPortal;
}
