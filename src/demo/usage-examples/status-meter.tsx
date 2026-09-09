"use client";

import { StatusCard, StatusMeter } from "../../components/ui/status-meter";
import { Button } from "../../components/ui/button";
import { useState } from "react";

export function StatusMeterExample() {
  const [value, setValue] = useState(4);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusCard title="Project health">
        <StatusMeter
          value={value}
          label="Example project health"
          startLabel="Needs attention"
          endLabel="Healthy"
        />
        <p className="rbx-description">
          합성 상태 예제입니다. 실제 계정 상태를 표시하지 않습니다.
        </p>
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
