"use client";

import { Textarea } from "../../components/ui/textarea";

export function TextareaExample() {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      소개
      <Textarea placeholder="어떤 경험을 만들고 싶나요?" />
    </label>
  );
}
