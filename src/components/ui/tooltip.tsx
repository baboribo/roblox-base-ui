"use client";

import {
  cloneElement,
  useSyncExternalStore,
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useState,
  type ComponentProps,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import {
  createTooltipDescription,
  descriptionForHandle,
  type TooltipDescription,
} from "../../lib/tooltip-description";
import { Tooltip as Primitive } from "@base-ui/react/tooltip";
import { withClassName } from "../../lib/cx";
import { createThemedPortal } from "../../lib/create-themed-portal";
import "./tooltip.css";

const ThemedPortal = createThemedPortal(Primitive.Portal);

const DescriptionContext = createContext<TooltipDescription | null>(null);
const emptyDescription = createTooltipDescription();

/** 표시 상태는 Base UI 한 곳에서 관리하고 설명 ID만 공유합니다. */
function TooltipRoot<Payload>(props: Primitive.Root.Props<Payload>) {
  const [local] = useState(createTooltipDescription);
  const description = props.handle ? descriptionForHandle(props.handle) : local;
  return (
    <DescriptionContext.Provider value={description}>
      <Primitive.Root {...props} />
    </DescriptionContext.Provider>
  );
}
function TooltipTrigger<Payload>({
  className,
  render,
  ...props
}: Primitive.Trigger.Props<Payload>) {
  const local = useContext(DescriptionContext);
  const description = props.handle
    ? descriptionForHandle(props.handle)
    : (local ?? emptyDescription);
  const id = useSyncExternalStore(
    description.subscribe,
    description.getSnapshot,
    description.getServerSnapshot,
  );
  return (
    <Primitive.Trigger
      {...props}
      className={withClassName("rbx-button", className)}
      render={(elementProps, state) => (
        <TooltipTriggerElement
          elementProps={elementProps}
          state={state}
          render={render}
          descriptionId={id}
        />
      )}
    />
  );
}
function TooltipTriggerElement({
  elementProps,
  state,
  render,
  descriptionId,
}: {
  elementProps: ComponentProps<"button">;
  state: Primitive.Trigger.State;
  render: Primitive.Trigger.Props<unknown>["render"];
  descriptionId?: string;
}) {
  const { ref, ...props } = elementProps;
  const element = useRender({
    defaultTagName: "button",
    render,
    ref,
    props,
    state: { ...state },
  });
  const describedBy = (element.props as ComponentProps<"button">)[
    "aria-describedby"
  ];
  const ids =
    [
      ...new Set(
        [
          ...(describedBy?.split(/\s+/) ?? []),
          state.open ? descriptionId : undefined,
        ].filter(Boolean),
      ),
    ].join(" ") || undefined;
  return cloneElement(element, {
    "aria-describedby": ids,
  } as ComponentProps<"button">);
}
function TooltipPopup({
  className,
  id: suppliedId,
  render,
  children,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const description = useContext(DescriptionContext);
  return (
    <Primitive.Popup
      role="tooltip"
      {...props}
      id={id}
      className={withClassName("rbx-tooltip", className)}
      render={(elementProps, state) => (
        <TooltipPopupSurface
          elementProps={elementProps}
          state={state}
          render={render}
          description={description}
        />
      )}
    >
      {children}
    </Primitive.Popup>
  );
}
function TooltipPopupSurface({
  elementProps,
  state,
  render,
  description,
}: {
  elementProps: ComponentProps<"div">;
  state: Primitive.Popup.State;
  render: ComponentProps<typeof Primitive.Popup>["render"];
  description: TooltipDescription | null;
}) {
  const { ref, ...props } = elementProps;
  const element = useRender({
    defaultTagName: "div",
    render,
    ref,
    props,
    state: { ...state },
  });
  const { id, children } = element.props as ComponentProps<"div">;
  // render 요소가 지정한 실제 ID와 내용도 설명 연결에 사용합니다.
  useLayoutEffect(() => {
    description?.set(id);
    return () => {
      if (description?.getSnapshot() === id) description?.set(undefined);
    };
  }, [description, id]);
  return cloneElement(
    element,
    {},
    <div className="rbx-tooltip-content">{children}</div>,
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
