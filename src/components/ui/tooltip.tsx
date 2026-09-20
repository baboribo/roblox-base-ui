"use client";

import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useState,
  type ComponentProps,
} from "react";
import { Tooltip as Primitive } from "@base-ui/react/tooltip";
import { withClassName } from "../../lib/cx";
import { createThemedPortal } from "../../lib/create-themed-portal";
import "./tooltip.css";

const ThemedPortal = createThemedPortal(Primitive.Portal);

const DescriptionContext = createContext<{
  id: string | undefined;
  setId: (id: string | undefined) => void;
  open: boolean;
} | null>(null);

/** 도움말의 표시 상태와 설명 ID만 연결하고, 열기·닫기 동작은 Base UI에 맡깁니다. */
function TooltipRoot<Payload>(props: Primitive.Root.Props<Payload>) {
  const [id, setId] = useState<string>();
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  return (
    <DescriptionContext.Provider
      value={{ id, setId, open: !props.disabled && (props.open ?? open) }}
    >
      <Primitive.Root
        {...props}
        onOpenChange={(next, details) => {
          props.onOpenChange?.(next, details);
          if (!details.isCanceled) setOpen(next);
        }}
      />
    </DescriptionContext.Provider>
  );
}

// 호출자가 지정한 설명은 유지하면서 현재 열린 도움말을 함께 연결합니다.
function TooltipTrigger<Payload>({
  className,
  "aria-describedby": describedBy,
  ...props
}: Primitive.Trigger.Props<Payload>) {
  const description = useContext(DescriptionContext);
  const ids =
    [describedBy, description?.open && description.id]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <Primitive.Trigger
      {...props}
      aria-describedby={ids}
      className={withClassName("rbx-button", className)}
    />
  );
}

function TooltipPopup({
  className,
  id: suppliedId,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const setId = useContext(DescriptionContext)?.setId;
  useLayoutEffect(() => {
    setId?.(id);
    return () => setId?.(undefined);
  }, [id, setId]);
  return (
    <Primitive.Popup
      role="tooltip"
      {...props}
      id={id}
      className={withClassName("rbx-tooltip", className)}
    />
  );
}

function TooltipPositioner({
  className,
  ...props
}: ComponentProps<typeof Primitive.Positioner>) {
  return (
    <Primitive.Positioner
      {...props}
      className={withClassName("rbx-positioner", className)}
    />
  );
}

function TooltipArrow({
  className,
  ...props
}: ComponentProps<typeof Primitive.Arrow>) {
  return (
    <Primitive.Arrow
      {...props}
      className={withClassName("rbx-tooltip-arrow", className)}
    />
  );
}

// Provider, handle 등 나머지 API는 Base UI 원본을 그대로 노출합니다.
export const Tooltip = {
  ...Primitive,
  Root: TooltipRoot,
  Portal: ThemedPortal,
  Trigger: TooltipTrigger,
  Popup: TooltipPopup,
  Positioner: TooltipPositioner,
  Arrow: TooltipArrow,
};
