"use client";
import {
  Card,
  CardMedia,
  CardImage,
  CardContent,
  CardTitle,
  CardMeta,
} from "../src/components/ui/card";

// 외부 파일 없이 실행할 수 있는 예제 이미지입니다.
const thumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" fill="#e2e7ed"/><rect x="30" y="24" width="100" height="120" rx="5" fill="#fff"/><rect x="44" y="40" width="72" height="38" rx="3" fill="#5679cc"/><path d="M44 94h48m-48 12h68m-68 12h56" stroke="#aab4c4" stroke-width="5"/></svg>',
  );

export function CardHorizontalExample() {
  return (
    <Card
      layout="horizontal"
      density="compact"
      style={{ width: "100%", maxWidth: 360 }}
    >
      <CardMedia>
        <CardImage src={thumbnail} alt="" />
      </CardMedia>
      <CardContent>
        <CardTitle as="h2">모바일 메인 화면</CardTitle>
        <CardMeta>프로젝트 · 30분 전 수정</CardMeta>
      </CardContent>
    </Card>
  );
}
