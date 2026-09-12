"use client";
import { Input } from "../src/components/ui/input";

export function InputSizesExample() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <label style={{ display: "grid", gap: 8 }}>
        xs · 24px
        <Input controlSize="xs" placeholder="프로젝트 이름" />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        sm · 32px
        <Input controlSize="sm" placeholder="프로젝트 이름" />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        md · 40px
        <Input controlSize="md" placeholder="프로젝트 이름" />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        lg · 48px
        <Input controlSize="lg" placeholder="프로젝트 이름" />
      </label>
    </div>
  );
}
