"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardMeta,
} from "../src/components/ui/card";

export function CardExample() {
  return (
    <Card style={{ width: "100%", maxWidth: 360 }}>
      <CardHeader>
        <CardTitle as="h2">웹사이트 리뉴얼</CardTitle>
        <CardDescription>
          메인 화면과 탐색 메뉴를 수정하는 프로젝트입니다.
        </CardDescription>
        <CardMeta>화면 8개 · 2시간 전 수정</CardMeta>
      </CardHeader>
    </Card>
  );
}
