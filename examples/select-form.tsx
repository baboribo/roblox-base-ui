"use client";
import { useState } from "react";
import { Select } from "../src/components/ui/select";
const options = [
  { value: "a", label: "디자인" },
  { value: "b", label: "개발" },
  { value: "c", label: "운영", disabled: true },
];
export function SelectFormExample() {
  const [result, setResult] = useState("");
  return (
    <form
      style={{ display: "grid", gap: 16, paddingBottom: 240 }}
      onSubmit={(event) => {
        event.preventDefault();
        setResult(
          JSON.stringify(
            Array.from(new FormData(event.currentTarget).entries()),
          ),
        );
      }}
      onReset={() => setResult("")}
    >
      <Select
        label="담당 분야"
        name="team"
        options={options}
        defaultValue="a"
        required
      />
      <Select
        multiple
        label="협업 분야"
        name="collaborators"
        options={options}
        defaultValue={["a", "b"]}
      />
      <button type="submit">제출</button>
      <button type="reset">초기값 복원</button>
      <output aria-label="제출된 값">{result}</output>
    </form>
  );
}
