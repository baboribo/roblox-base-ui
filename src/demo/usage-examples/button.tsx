"use client";

import { Button, type ButtonVariant } from "../../components/ui/button";

export function ButtonExample() {
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
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 24,
        }}
      >
        {variants.map((variant) => (
          <div key={variant}>
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
