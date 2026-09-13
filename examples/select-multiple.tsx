"use client";
import { useState } from "react";
import { Select } from "../src/components/ui/select";
const options = [
  { value: "design", label: "디자인" },
  { value: "development", label: "개발" },
  { value: "operations", label: "운영" },
];
export function SelectMultipleExample() {
  const [value, setValue] = useState<string[]>(["design", "development"]);
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <Select
        multiple
        label="분야"
        options={options}
        value={value}
        onValueChange={setValue}
        description="여러 분야를 선택할 수 있습니다."
      />
      <p role="status">
        선택한 분야:{" "}
        {options
          .filter((option) => value.includes(option.value))
          .map((option) => option.label)
          .join(", ") || "없음"}
      </p>
    </div>
  );
}
