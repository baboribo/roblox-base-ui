"use client";

import { Slider } from "../src/components/ui/slider";

export function SliderExample() {
  return (
    <Slider.Root defaultValue={65}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <Slider.Label>음량</Slider.Label>
        <Slider.Value />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb aria-label="음량" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
