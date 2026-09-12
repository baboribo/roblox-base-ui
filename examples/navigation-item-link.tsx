"use client";
import { NavigationLink } from "../src/components/ui/navigation-item";

export function NavigationItemLinkExample() {
  return (
    <NavigationLink
      href="/docs/sources"
      target="_top"
      icon="icon-regular-fountain-pen-nib"
    >
      출처 문서로 이동
    </NavigationLink>
  );
}
