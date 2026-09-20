"use client";

import { useEffect, type ComponentProps } from "react";
import { Toast as Primitive } from "@base-ui/react/toast";
import { withClassName } from "../../lib/cx";
import { createThemedPortal } from "../../lib/create-themed-portal";
import "./toast.css";

const ThemedPortal = createThemedPortal(Primitive.Portal);

// limit만 줄이면 이전 알림이 다시 나타날 수 있습니다.
// 교체된 알림은 닫아 타이머와 상태도 함께 정리합니다.
function ReplacePreviousToast() {
  const { toasts, close } = Primitive.useToastManager();
  useEffect(() => {
    for (const toast of toasts) {
      if (toast.limited && toast.transitionStatus !== "ending") close(toast.id);
    }
  }, [toasts, close]);
  return null;
}

function ToastProvider({
  children,
  ...props
}: Omit<ComponentProps<typeof Primitive.Provider>, "limit">) {
  return (
    <Primitive.Provider {...props} limit={1}>
      <ReplacePreviousToast />
      {children}
    </Primitive.Provider>
  );
}

function ToastViewport({
  className,
  ...props
}: ComponentProps<typeof Primitive.Viewport>) {
  return (
    <Primitive.Viewport
      aria-label="알림"
      {...props}
      className={withClassName("rbx-toast-viewport", className)}
    />
  );
}
function ToastRoot({
  className,
  ...props
}: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      {...props}
      className={withClassName("rbx-toast", className)}
    />
  );
}
function ToastContent({
  className,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Content
      {...props}
      className={withClassName("rbx-toast-content", className)}
    />
  );
}
function ToastTitle({
  className,
  ...props
}: ComponentProps<typeof Primitive.Title>) {
  return (
    <Primitive.Title
      {...props}
      className={withClassName("rbx-toast-title", className)}
    />
  );
}
function ToastDescription({
  className,
  ...props
}: ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      {...props}
      className={withClassName("rbx-toast-description", className)}
    />
  );
}
function ToastClose({
  className,
  ...props
}: ComponentProps<typeof Primitive.Close>) {
  return (
    <Primitive.Close
      aria-hidden={false}
      {...props}
      className={withClassName("rbx-toast-close", className)}
    />
  );
}
function ToastAction({
  className,
  ...props
}: ComponentProps<typeof Primitive.Action>) {
  return (
    <Primitive.Action
      {...props}
      className={withClassName("rbx-toast-action", className)}
    />
  );
}

function StatusIcon({ type }: { type: string }) {
  return (
    <svg
      className="rbx-toast-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      {type === "success" ? (
        <path d="m8 12 3 3 5-6" />
      ) : (
        <path d="M12 7v6m0 4h.01" />
      )}
    </svg>
  );
}

// 기본 구성을 한 곳에 두고, 사용하는 쪽에서는 메시지와 작업을 전달합니다.
function ToastToaster() {
  const { toasts } = Primitive.useToastManager();
  return (
    <ThemedPortal>
      <ToastViewport>
        {toasts.map((toast) => (
          <ToastRoot key={toast.id} toast={toast}>
            <ToastContent>
              {(toast.type === "success" || toast.type === "error") && (
                <StatusIcon type={toast.type} />
              )}
              <div className="rbx-toast-text">
                <ToastTitle />
                <ToastDescription />
              </div>
              <ToastAction />
              {Boolean(toast.description || toast.actionProps?.children) && (
                <ToastClose aria-label="알림 닫기">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </ToastClose>
              )}
            </ToastContent>
          </ToastRoot>
        ))}
      </ToastViewport>
    </ThemedPortal>
  );
}

// manager의 add/update/close/promise 및 전역 manager API는 Base UI 그대로 사용합니다.
export const Toast = {
  ...Primitive,
  Portal: ThemedPortal,
  Provider: ToastProvider,
  Toaster: ToastToaster,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
  Action: ToastAction,
};
