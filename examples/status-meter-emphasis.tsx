"use client";
import { StatusMeter } from "../src/components/ui/status-meter";

export function StatusMeterEmphasisExample() {
  return (
    <StatusMeter
      label="프로젝트 상태"
      value={3}
      tone="emphasis"
      startLabel="확인 필요"
      endLabel="정상"
    />
  );
}
