"use client";
import { NavigationItem } from "../src/components/ui/navigation-item";
import { Badge } from "../src/components/ui/badge";

export function NavigationItemTrailingExample() {
  return (
    <NavigationItem icon="icon-regular-two-people" trailing={<Badge>12</Badge>}>
      멤버
    </NavigationItem>
  );
}
