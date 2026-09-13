"use client";
import { Icon } from "../src/components/ui/icon";
import { useState } from "react";
import { Button } from "../src/components/ui/button";
import {
  Card,
  CardMedia,
  CardImage,
  CardHeader,
  CardTitle,
  CardMeta,
  CardAction,
} from "../src/components/ui/card";

const thumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="m120 38 74 42-74 44-74-44z" fill="#86a4ed"/><path d="m46 80 74 44v82l-74-44z" fill="#436bc1"/><path d="m120 124 74-44v82l-74 44z" fill="#294981"/></svg>',
  );

export function CardAssetSelectExample() {
  const [selected, setSelected] = useState(false);
  const [added, setAdded] = useState(false);
  return (
    <div style={{ width: "100%", maxWidth: 320, display: "grid", gap: 16 }}>
      <Card
        variant="plain"
        selected={selected}
        style={{ width: "100%", maxWidth: 200 }}
      >
        <CardMedia ratio="square">
          <CardImage src={thumbnail} alt="" fit="contain" />
          {selected && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                borderRadius: 4,
                padding: "4px 8px",
                background: "var(--rbx-color-system-emphasis)",
                color: "white",
                font: "var(--rbx-typography-body-small-font)",
              }}
            >
              <Icon name="icon-filled-check" size={16} /> 선택됨
            </span>
          )}
        </CardMedia>
        <CardHeader>
          <CardTitle as="h2">
            <CardAction
              aria-pressed={selected}
              onClick={() => setSelected(!selected)}
            >
              기본 큐브
            </CardAction>
          </CardTitle>
          <CardMeta>3D 모델 · GLB · 24 KB</CardMeta>
        </CardHeader>
      </Card>
      <Button
        size="sm"
        style={{ justifySelf: "start" }}
        disabled={!selected || added}
        onClick={() => {
          setAdded(true);
          setSelected(false);
        }}
      >
        {added ? "추가 완료" : "작업에 추가"}
      </Button>
      <section
        aria-label="작업에 추가된 에셋"
        style={{
          borderTop: "1px solid var(--rbx-color-stroke-default)",
          paddingTop: 12,
        }}
      >
        <h2
          style={{ margin: 0, font: "var(--rbx-typography-title-large-font)" }}
        >
          작업 에셋
        </h2>
        <p
          role="status"
          style={{
            margin: "8px 0",
            font: "var(--rbx-typography-body-small-font)",
          }}
        >
          {added ? "기본 큐브를 추가했습니다." : "추가된 에셋이 없습니다."}
        </p>
        {added && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span>기본 큐브</span>
              <Button
                size="sm"
                variant="standard"
                aria-label="기본 큐브 제거"
                onClick={() => setAdded(false)}
              >
                제거
              </Button>
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}
