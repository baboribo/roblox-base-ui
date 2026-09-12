"use client";
import { Button } from "../src/components/ui/button";

export function ButtonOverMediaExample() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 176,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        background:
          "linear-gradient(135deg, #b9c4ce 0%, #6d8496 50%, #344b60 100%)",
      }}
    >
      <Button variant="over-media">미리보기</Button>
    </div>
  );
}
