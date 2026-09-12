"use client";
import { useState } from "react";
import { Button } from "../src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardLink,
} from "../src/components/ui/card";

export function CardActionsExample() {
  const [favorite, setFavorite] = useState(false);
  return (
    <div style={{ width: "100%", maxWidth: 360, display: "grid", gap: 12 }}>
      <Card>
        <CardHeader>
          <CardTitle as="h2">
            <CardLink href="/docs" target="_top">
              컴포넌트 문서
            </CardLink>
          </CardTitle>
          <CardDescription>
            컴포넌트별 사용법과 예제 코드입니다.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            size="sm"
            variant="standard"
            aria-pressed={favorite}
            onClick={() => setFavorite(!favorite)}
          >
            {favorite ? "즐겨찾기 해제" : "즐겨찾기"}
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            render={<a href="/docs" target="_top" />}
          >
            열기
          </Button>
        </CardFooter>
      </Card>
      <p
        role="status"
        style={{ margin: 0, font: "var(--rbx-typography-body-small-font)" }}
      >
        {favorite ? "즐겨찾기에 추가했습니다." : ""}
      </p>
    </div>
  );
}
