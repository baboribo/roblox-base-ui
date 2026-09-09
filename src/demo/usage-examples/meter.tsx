"use client";

import { Meter } from "../../components/ui/meter";

export function MeterExample() {
  return (
    <Meter.Root value={72}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <Meter.Label>저장 공간</Meter.Label>
        <Meter.Value />
      </div>
      <Meter.Track>
        <Meter.Indicator />
      </Meter.Track>
    </Meter.Root>
  );
}
