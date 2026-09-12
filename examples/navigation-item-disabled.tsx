"use client";
import { NavigationItem } from "../src/components/ui/navigation-item";

export function NavigationItemDisabledExample() {
  return (
    <NavigationItem icon="icon-regular-backpack" disabled>
      준비 중인 페이지
    </NavigationItem>
  );
}
