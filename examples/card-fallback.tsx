"use client";
import { useState } from "react";
import { Button } from "../src/components/ui/button";
import {
  Card,
  CardMedia,
  CardImage,
  CardHeader,
  CardTitle,
  CardMeta,
  CardFooter,
} from "../src/components/ui/card";

const thumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#dce2e9"/><rect x="40" y="32" width="560" height="360" rx="8" fill="#fff"/><path d="M40 72h560M168 72v288" stroke="#e0e3e8"/><rect x="56" y="48" width="56" height="8" rx="4" fill="#303640"/><path d="M60 100h76m-76 24h60m-60 24h68m-68 24h48" stroke="#a6aeba" stroke-width="6"/><rect x="200" y="102" width="152" height="16" rx="4" fill="#303640"/><rect x="200" y="134" width="288" height="8" rx="4" fill="#bbc2cc"/><rect x="200" y="174" width="164" height="104" rx="6" fill="#eff1f4"/><rect x="380" y="174" width="188" height="104" rx="6" fill="#eff1f4"/><rect x="224" y="208" width="116" height="36" rx="6" fill="#335fff"/><path d="M408 202h108m-108 20h132m-132 20h92M200 310h280" stroke="#b2bac6" stroke-width="8"/></svg>',
  );

export function CardFallbackExample() {
  const [recovered, setRecovered] = useState(false);
  return (
    <Card style={{ width: "100%", maxWidth: 320 }}>
      <CardMedia>
        <CardImage
          src={recovered ? thumbnail : "data:image/png;base64,invalid"}
          alt="문서 화면 미리보기"
          fallback="미리보기를 불러올 수 없습니다"
        />
      </CardMedia>
      <CardHeader>
        <CardTitle as="h2">작업 노트</CardTitle>
        <CardMeta>문서 · 오늘 수정</CardMeta>
      </CardHeader>
      <CardFooter>
        <Button
          size="sm"
          variant="standard"
          disabled={recovered}
          onClick={() => setRecovered(true)}
        >
          {recovered ? "이미지 교체됨" : "정상 이미지로 교체"}
        </Button>
      </CardFooter>
    </Card>
  );
}
