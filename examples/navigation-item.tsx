"use client";
import { useState } from "react";
import { NavigationItem } from "../src/components/ui/navigation-item";
export function NavigationItemExample() {
  const [active, setActive] = useState(false);
  return (
    <NavigationItem
      icon="icon-regular-house"
      active={active}
      onClick={() => setActive(!active)}
    >
      홈
    </NavigationItem>
  );
}
