"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button as Primitive } from "@base-ui/react/button";
import { useRender } from "@base-ui/react/use-render";
import { cx, withClassName } from "../../lib/cx";
import { Icon, type IconName } from "./icon";
import "./navigation-item.css";

type NavigationContentProps = {
  icon?: IconName;
  /** Avatar 등으로 아이콘 자리를 교체합니다. 내부에 버튼을 넣지 마세요. */
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
};
export type NavigationItemProps = ComponentProps<typeof Primitive> &
  NavigationContentProps & { active?: boolean };
export type NavigationLinkProps = useRender.ComponentProps<
  "a",
  { active: boolean }
> &
  NavigationContentProps & { active?: boolean };

// 버튼과 링크가 같은 시각 파트를 재사용합니다. 동작은 각 HTML 역할을 보존합니다.
function NavigationContent({
  icon,
  leading,
  trailing,
  children,
}: NavigationContentProps) {
  const visual = leading ?? (icon ? <Icon name={icon} size={24} /> : null);
  return (
    <>
      {visual && <span className="rbx-navigation-item-leading">{visual}</span>}
      <span className="rbx-navigation-item-label">{children}</span>
      {trailing && (
        <span className="rbx-navigation-item-trailing">{trailing}</span>
      )}
    </>
  );
}
/** 화면 내 선택/작업: Base UI Button. */
export function NavigationItem({
  icon,
  leading,
  trailing,
  active = false,
  children,
  className,
  ...props
}: NavigationItemProps) {
  return (
    <Primitive
      aria-current={active ? "page" : undefined}
      {...props}
      data-active={active || undefined}
      data-leading={icon || leading ? "true" : undefined}
      className={withClassName("rbx-navigation-item", className)}
    >
      <NavigationContent icon={icon} leading={leading} trailing={trailing}>
        {children}
      </NavigationContent>
    </Primitive>
  );
}
/** 페이지 이동: native anchor. render={<Link href="…" />}로 라우터도 조합합니다. */
export function NavigationLink({
  icon,
  leading,
  trailing,
  active = false,
  children,
  className,
  render,
  ref,
  ...props
}: NavigationLinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    ref,
    state: { active },
    props: {
      "aria-current": active ? "page" : undefined,
      ...props,
      "data-leading": icon || leading ? "true" : undefined,
      className: cx("rbx-navigation-item", className),
      children: (
        <NavigationContent icon={icon} leading={leading} trailing={trailing}>
          {children}
        </NavigationContent>
      ),
    },
  });
}
