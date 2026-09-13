"use client";
import { Select } from "../src/components/ui/select";
const options = [
  { value: "public", label: "전체 공개" },
  { value: "friends", label: "친구만" },
  { value: "private", label: "비공개" },
];
export function SelectSizesExample() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: 24,
        paddingBottom: 240,
      }}
    >
      {(["sm", "md", "lg"] as const).map((size) => (
        <Select
          key={size}
          label={`크기 ${size.toUpperCase()}`}
          size={size}
          options={options}
          defaultValue="public"
        />
      ))}
    </div>
  );
}
