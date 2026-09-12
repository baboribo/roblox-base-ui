"use client";
import {
  Card,
  CardMedia,
  CardImage,
  CardHeader,
  CardTitle,
  CardMeta,
} from "../src/components/ui/card";

// 외부 파일 없이 실행할 수 있는 예제 이미지입니다.
const thumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 270"><rect width="630" height="270" fill="#d7e5eb"/><path d="m0 220 150-130 130 105 120-150 230 175v50H0z" fill="#819faa"/><path d="m0 240 220-75 170 60 240-65v110H0z" fill="#4b6b74"/></svg>',
  );

export function CardWideExample() {
  return (
    <Card variant="plain" style={{ width: "100%", maxWidth: 420 }}>
      <CardMedia ratio="wide">
        <CardImage src={thumbnail} alt="산 능선이 겹쳐진 배너 일러스트" />
      </CardMedia>
      <CardHeader>
        <CardTitle as="h2">산 배경</CardTitle>
        <CardMeta>배너 · SVG · 630 × 270</CardMeta>
      </CardHeader>
    </Card>
  );
}
