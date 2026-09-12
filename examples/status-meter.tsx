"use client";

import { StatusCard, StatusMeter } from "../src/components/ui/status-meter";
import { Button } from "../src/components/ui/button";
import { useState } from "react";

export function StatusMeterExample() {
  const [value, setValue] = useState(4);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusCard title="프로젝트 상태">
        <StatusMeter
          value={value}
          label="프로젝트 상태"
          startLabel="확인 필요"
          endLabel="정상"
        />
        <p className="rbx-description">버튼으로 상태 단계를 변경합니다.</p>
      </StatusCard>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {[1, 2, 3, 4].map((level) => (
          <Button
            key={level}
            size="xs"
            variant="standard"
            onClick={() => setValue(level)}
          >
            {level} / 4
          </Button>
        ))}
      </div>
    </div>
  );
}
