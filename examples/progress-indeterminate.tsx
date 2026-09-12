"use client";
import { Progress } from "../src/components/ui/progress";

export function ProgressIndeterminateExample() {
  return (
    <Progress.Root value={null}>
      <Progress.Label>업로드 준비 중</Progress.Label>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>
  );
}
