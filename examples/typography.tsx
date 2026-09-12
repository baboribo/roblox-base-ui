"use client";

import { Heading, Text, Code } from "../src/components/ui/typography";

export function TypographyExample() {
  return (
    <div>
      <Heading>제목</Heading>
      <Text>본문 텍스트입니다.</Text>
      <Code>--rbx-radius-medium: 8px</Code>
    </div>
  );
}
