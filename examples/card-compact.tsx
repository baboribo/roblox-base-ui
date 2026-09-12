"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
} from "../src/components/ui/card";

export function CardCompactExample() {
  return (
    <Card density="compact" style={{ width: "100%", maxWidth: 280 }}>
      <CardHeader>
        <CardTitle as="h2">아이콘 모음</CardTitle>
        <CardMeta>SVG 48개 · 오늘 수정</CardMeta>
      </CardHeader>
    </Card>
  );
}
