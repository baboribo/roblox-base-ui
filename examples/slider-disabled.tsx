"use client";
import { Slider } from "../src/components/ui/slider";

export function SliderDisabledExample() {
  return (
    <Slider.Root defaultValue={50} disabled>
      <Slider.Label>음량</Slider.Label>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb aria-label="음량" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
