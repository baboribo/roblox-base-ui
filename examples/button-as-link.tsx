"use client";
import { Button } from "../src/components/ui/button";

export function ButtonAsLinkExample() {
  return (
    <Button
      variant="standard"
      size="md"
      render={<a href="/docs/installation" target="_top" />}
    >
      설치 안내 보기
    </Button>
  );
}
