"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardMeta,
} from "../src/components/ui/card";

export function CardFilledExample() {
  return (
    <Card variant="filled" style={{ width: "100%", maxWidth: 360 }}>
      <CardHeader>
        <CardTitle as="h2">공유 폴더</CardTitle>
        <CardDescription>
          팀에서 함께 사용하는 이미지와 문서입니다.
        </CardDescription>
        <CardMeta>파일 24개 · 멤버 3명</CardMeta>
      </CardHeader>
    </Card>
  );
}
