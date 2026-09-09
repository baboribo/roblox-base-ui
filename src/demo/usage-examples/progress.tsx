"use client";

import { Progress } from "../../components/ui/progress";

export function ProgressExample() {
  return (
    <Progress.Root value={64}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <Progress.Label>에셋 업로드</Progress.Label>
        <Progress.Value />
      </div>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>
  );
}
