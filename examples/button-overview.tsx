"use client";

import { Button, type ButtonVariant } from "../src/components/ui/button";

export function ButtonOverviewExample() {
  const variants: ButtonVariant[] = [
    "emphasis",
    "standard",
    "soft-emphasis",
    "sub-emphasis",
    "subtle",
    "utility",
    "over-media",
    "alert",
    "link",
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 24,
        }}
      >
        {variants.map((variant) => (
          <div
            key={variant}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <Button variant={variant}>
              {variant === "emphasis"
                ? "계속하기"
                : variant === "alert"
                  ? "삭제하기"
                  : "버튼 레이블"}
            </Button>
            <code>{variant}</code>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {(["xs", "sm", "md", "lg"] as const).map((size) => (
          <Button key={size} size={size}>
            Size {size}
          </Button>
        ))}
        <Button disabled>비활성</Button>
      </div>
    </div>
  );
}
