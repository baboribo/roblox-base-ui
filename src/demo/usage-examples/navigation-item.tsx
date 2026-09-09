"use client";

import { useState } from "react";
import {
  NavigationItem,
  NavigationLink,
} from "../../components/ui/navigation-item";
import { Badge } from "../../components/ui/badge";

export function NavigationItemExample() {
  const [active, setActive] = useState(true);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 256,
      }}
    >
      <NavigationItem
        icon="icon-regular-house"
        active={active}
        onClick={() => setActive(!active)}
      >
        Home
      </NavigationItem>
      <NavigationLink href="#sources" icon="icon-regular-fountain-pen-nib">
        출처 문서로 이동
      </NavigationLink>
      <NavigationItem
        icon="icon-regular-two-people"
        trailing={<Badge>12</Badge>}
      >
        Connections
      </NavigationItem>
      <NavigationItem icon="icon-regular-backpack" disabled>
        준비 중인 페이지
      </NavigationItem>
    </div>
  );
}
