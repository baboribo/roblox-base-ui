"use client";
import { Button } from "../src/components/ui/button";

export function ButtonDisabledExample() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <Button>저장</Button>
        <span style={{ fontSize: 12 }}>기본</span>
      </div>
      <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
        <Button disabled>저장</Button>
        <span style={{ fontSize: 12 }}>비활성</span>
      </div>
    </div>
  );
}
