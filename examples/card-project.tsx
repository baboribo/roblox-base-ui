"use client";
import {
  Card,
  CardMedia,
  CardImage,
  CardHeader,
  CardTitle,
  CardMeta,
  CardLink,
} from "../src/components/ui/card";

// 외부 파일 없이 실행할 수 있는 예제 이미지입니다.
const thumbnail =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#dce2e9"/><rect x="40" y="32" width="560" height="360" rx="8" fill="#fff"/><path d="M40 72h560M168 72v288" stroke="#e0e3e8"/><rect x="56" y="48" width="56" height="8" rx="4" fill="#303640"/><path d="M60 100h76m-76 24h60m-60 24h68m-68 24h48" stroke="#a6aeba" stroke-width="6"/><rect x="200" y="102" width="152" height="16" rx="4" fill="#303640"/><rect x="200" y="134" width="288" height="8" rx="4" fill="#bbc2cc"/><rect x="200" y="174" width="164" height="104" rx="6" fill="#eff1f4"/><rect x="380" y="174" width="188" height="104" rx="6" fill="#eff1f4"/><rect x="224" y="208" width="116" height="36" rx="6" fill="#335fff"/><path d="M408 202h108m-108 20h132m-132 20h92M200 310h280" stroke="#b2bac6" stroke-width="8"/></svg>',
  );

export function CardProjectExample() {
  return (
    <Card variant="plain" style={{ width: "100%", maxWidth: 320 }}>
      <CardMedia>
        <CardImage src={thumbnail} alt="" />
      </CardMedia>
      <CardHeader>
        <CardTitle as="h2">
          <CardLink href="/docs" target="_top">
            UI 문서
          </CardLink>
        </CardTitle>
        <CardMeta>문서 사이트 · 2시간 전 수정</CardMeta>
      </CardHeader>
    </Card>
  );
}
