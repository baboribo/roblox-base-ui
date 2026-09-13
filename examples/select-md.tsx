"use client";
import { Select } from "../src/components/ui/select";
const options = [
  { value: "public", label: "전체 공개" },
  { value: "friends", label: "친구만" },
  { value: "private", label: "비공개" },
];
export function SelectMdExample() {
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <Select
        label="공개 범위"
        options={options}
        size="md"
        defaultValue="public"
      />
    </div>
  );
}
