"use client";

import { PreviewCard } from "../src/components/ui/preview-card";

export function PreviewCardExample() {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        href="https://about.roblox.com"
        target="_blank"
        rel="noreferrer"
      >
        Roblox 회사 사이트
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={8}>
          <PreviewCard.Popup>
            <strong>About Roblox</strong>
            <p className="rbx-description">
              회사 사이트의 공개 색상과 타이포그래피를 참고했습니다.
            </p>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}
