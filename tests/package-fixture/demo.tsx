"use client";
import { useState } from "react";
import { Button, Switch } from "ply-ui";
import { Select } from "ply-ui/select";

export default function Demo() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ maxWidth: 320, padding: 24, display: "grid", gap: 16 }}>
      <Button onClick={() => setCount(count + 1)}>저장</Button>
      <p role="status">저장 {count}회</p>
      <Switch.Root aria-label="알림">
        <Switch.Thumb />
      </Switch.Root>
      <Select
        label="공개 범위"
        defaultValue="public"
        options={[
          { value: "public", label: "전체 공개" },
          { value: "private", label: "비공개" },
        ]}
      />
      <Select
        multiple
        label="분야"
        defaultValue={["design"]}
        options={[
          { value: "design", label: "디자인" },
          { value: "development", label: "개발" },
        ]}
      />
    </main>
  );
}
