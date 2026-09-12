"use client";
import { StatusMeter } from "../src/components/ui/status-meter";

export function StatusMeterSuccessExample() {
  return (
    <StatusMeter
      label="프로젝트 상태"
      value={3}
      tone="success"
      startLabel="확인 필요"
      endLabel="정상"
    />
  );
}
