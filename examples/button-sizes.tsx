"use client";
import { Button } from "../src/components/ui/button";

export function ButtonSizesExample() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "end",
        justifyContent: "center",
        gap: 32,
      }}
    >
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <div
          key={size}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Button size={size}>저장</Button>
          <span style={{ fontSize: 12 }}>
            {size}
            {size === "lg" ? " · 기본값" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
