"use client";
import { useState } from "react";
import { Select } from "../src/components/ui/select";
const options = [
  { value: "public", label: "전체 공개" },
  { value: "friends", label: "친구만" },
  { value: "private", label: "비공개" },
];
export function SelectControlledExample() {
  const [value, setValue] = useState<string | null>("public");
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <Select
        label="공개 범위"
        options={options}
        value={value}
        onValueChange={setValue}
      />
      <p role="status">선택값: {value ?? "없음"}</p>
    </div>
  );
}
