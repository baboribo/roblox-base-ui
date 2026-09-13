"use client";
import { Icon } from "../src/components/ui/icon";

import { NavigationMenu } from "../src/components/ui/navigation-menu";

export function NavigationMenuExample() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>
            가이드 <Icon name="icon-regular-chevron-large-down" size={16} />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/docs/installation" target="_top">
              설치 방법
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/docs/foundations" target="_top">
              디자인 토큰
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="rbx-button"
            href="/docs/sources"
            target="_top"
          >
            출처
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner sideOffset={8}>
          <NavigationMenu.Popup>
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
