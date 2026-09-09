"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cx, withClassName } from "../../lib/cx";
import { IconButton } from "./icon-button";
import { ScrollArea } from "./scroll-area";
import { NavigationItem, NavigationLink } from "./navigation-item";
import "./sidebar.css";

// CSS의 breakpoint와 맞춥니다. SSR에서는 desktop → hydration 후 실제 viewport 적용.
const mobileQuery = "(max-width: 1140px)";
function subscribeViewport(notify: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
const getMobile = () => window.matchMedia(mobileQuery).matches;
const getServerMobile = () => false;
type SidebarContextValue = {
  mobile: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  handle: ReturnType<typeof Dialog.createHandle>;
  actionsRef: React.RefObject<Dialog.Root.Actions | null>;
};
const SidebarContext = createContext<SidebarContextValue | null>(null);
function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error(
      "Sidebar.Panel/Trigger는 Sidebar.Provider 안에 배치하세요.",
    );
  return context;
}

type ProviderProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
/** open은 모바일 패널의 상태입니다. desktop에서는 항상 표시합니다. */
function SidebarProvider({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: ProviderProps) {
  const mobile = useSyncExternalStore(
    subscribeViewport,
    getMobile,
    getServerMobile,
  );
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const dialogActions = useRef<Dialog.Root.Actions>(null);
  const [handle] = useState(() => Dialog.createHandle());
  const isOpen = open ?? internalOpen;
  const setOpen = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };
  // 넓은 화면으로 전환하면 focus trap / scroll lock을 해제하고 다음 열림도 초기화합니다.
  useEffect(() => {
    if (!mobile) {
      // Panel이 desktop DOM으로 바뀌면 transitionend가 발생하지 않습니다.
      // Base UI의 공식 action으로 종료 상태도 정리해 재등장하는 빈 모달을 막습니다.
      dialogActions.current?.unmount();
      if (isOpen) {
        setInternalOpen(false);
        onOpenChange?.(false);
      }
    }
  }, [mobile, isOpen, onOpenChange]);
  return (
    <SidebarContext.Provider
      value={{
        mobile,
        open: mobile && isOpen,
        setOpen,
        handle,
        actionsRef: dialogActions,
      }}
    >
      {/* Dialog.Root는 Panel에만 둡니다. 앱 전체를 감싸면 다른 모달의 Backdrop이 생략됩니다. */}
      {children}
    </SidebarContext.Provider>
  );
}
function SidebarRoot({ className, ...props }: ComponentProps<"aside">) {
  return <aside {...props} className={cx("rbx-sidebar", className)} />;
}
/** 단일 children 트리만 렌더합니다. 검색 input/id가 desktop/mobile에 중복되지 않습니다. */
function SidebarPanel({
  title,
  closeLabel = "Close navigation",
  children,
  className,
  ...props
}: ComponentProps<"aside"> & { title: string; closeLabel?: string }) {
  const { mobile, open, setOpen, handle, actionsRef } = useSidebar();
  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
      handle={handle}
      actionsRef={actionsRef}
    >
      {!mobile ? (
        <SidebarRoot aria-label={title} {...props} className={className}>
          {children}
        </SidebarRoot>
      ) : (
        <Dialog.Portal>
          <Dialog.Backdrop className="rbx-sidebar-backdrop" />
          <Dialog.Popup
            className="rbx-sidebar-popup"
            aria-describedby={undefined}
          >
            <div className="rbx-sidebar-mobile-heading">
              <Dialog.Title className="rbx-sidebar-mobile-title">
                {title}
              </Dialog.Title>
              <Dialog.Close
                render={
                  <IconButton
                    icon="icon-regular-x"
                    size="sm"
                    variant="utility"
                    aria-label={closeLabel}
                  />
                }
              />
            </div>
            <SidebarRoot {...props} className={className}>
              {children}
            </SidebarRoot>
          </Dialog.Popup>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
function SidebarTrigger({
  className,
  ...props
}: ComponentProps<typeof Dialog.Trigger>) {
  const { handle } = useSidebar();
  return (
    <Dialog.Trigger
      handle={handle}
      {...props}
      className={withClassName("rbx-sidebar-trigger", className)}
    />
  );
}
function SidebarContent({
  children,
  className,
  ...props
}: ComponentProps<typeof ScrollArea.Root>) {
  return (
    <ScrollArea.Root
      {...props}
      className={withClassName("rbx-sidebar-scroll", className)}
    >
      <ScrollArea.Viewport className="rbx-sidebar-viewport">
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-sidebar-header", className)} />;
}
function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-sidebar-footer", className)} />;
}
function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={cx("rbx-sidebar-group", className)} />;
}
function SidebarGroupLabel({ className, ...props }: ComponentProps<"h2">) {
  return <h2 {...props} className={cx("rbx-sidebar-group-label", className)} />;
}
function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  return <ul {...props} className={cx("rbx-sidebar-menu", className)} />;
}
function SidebarItem({ className, ...props }: ComponentProps<"li">) {
  return <li {...props} className={cx("rbx-sidebar-item", className)} />;
}
export const Sidebar = {
  Provider: SidebarProvider,
  Panel: SidebarPanel,
  Trigger: SidebarTrigger,
  Root: SidebarRoot,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Menu: SidebarMenu,
  Item: SidebarItem,
  Action: NavigationItem,
  Link: NavigationLink,
};
