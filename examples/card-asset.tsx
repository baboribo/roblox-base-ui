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
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><path d="m120 38 74 42-74 44-74-44z" fill="#86a4ed"/><path d="m46 80 74 44v82l-74-44z" fill="#436bc1"/><path d="m120 124 74-44v82l-74 44z" fill="#294981"/></svg>',
  );

export function CardAssetExample() {
  return (
    <Card variant="plain" style={{ width: "100%", maxWidth: 200 }}>
      <CardMedia ratio="square">
        <CardImage
          src={thumbnail}
          alt="파란색 정육면체의 3D 미리보기"
          fit="contain"
        />
      </CardMedia>
      <CardHeader>
        <CardTitle as="h2">기본 큐브</CardTitle>
        <CardMeta>3D 모델 · GLB · 24 KB</CardMeta>
      </CardHeader>
    </Card>
  );
}
