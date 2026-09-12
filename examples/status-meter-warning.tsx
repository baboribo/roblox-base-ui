"use client";
import { StatusMeter } from "../src/components/ui/status-meter";

export function StatusMeterWarningExample() {
  return (
    <StatusMeter
      label="프로젝트 상태"
      value={3}
      tone="warning"
      startLabel="확인 필요"
      endLabel="정상"
    />
  );
}
