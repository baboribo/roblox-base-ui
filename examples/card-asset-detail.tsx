"use client";
import { useRef, useState } from "react";
import {
  Card,
  CardMedia,
  CardImage,
  CardHeader,
  CardTitle,
  CardMeta,
  CardAction,
} from "../src/components/ui/card";
import { Dialog } from "../src/components/ui/dialog";

const thumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="m120 38 74 42-74 44-74-44z" fill="#86a4ed"/><path d="m46 80 74 44v82l-74-44z" fill="#436bc1"/><path d="m120 124 74-44v82l-74 44z" fill="#294981"/></svg>',
  );

export function CardAssetDetailExample() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Card variant="plain" style={{ width: "100%", maxWidth: 200 }}>
        <CardMedia ratio="square">
          <CardImage src={thumbnail} alt="" fit="contain" />
        </CardMedia>
        <CardHeader>
          <CardTitle as="h2">
            <CardAction
              ref={triggerRef}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              기본 큐브
            </CardAction>
          </CardTitle>
          <CardMeta>3D 모델 · GLB · 24 KB</CardMeta>
        </CardHeader>
      </Card>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup
          ref={popupRef}
          initialFocus={popupRef}
          finalFocus={triggerRef}
        >
          <Dialog.CloseAffordance aria-label="닫기" />
          <Dialog.Body>
            <Dialog.Title>기본 큐브</Dialog.Title>
            <Dialog.Description>3D 모델 · GLB · 24 KB</Dialog.Description>
            <CardMedia
              ratio="square"
              style={{ marginTop: 16, borderRadius: 8 }}
            >
              <CardImage
                src={thumbnail}
                alt="파란색 정육면체의 확대 미리보기"
                fit="contain"
              />
            </CardMedia>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 0,
              }}
            >
              <dt>크기</dt>
              <dd style={{ margin: 0 }}>1 × 1 × 1 m</dd>
              <dt>폴리곤</dt>
              <dd style={{ margin: 0 }}>12개</dd>
            </dl>
          </Dialog.Body>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
