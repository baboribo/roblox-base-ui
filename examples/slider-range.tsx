"use client";
import { Slider } from "../src/components/ui/slider";

export function SliderRangeExample() {
  return (
    <Slider.Root defaultValue={[20, 80]}>
      <Slider.Label>가격 범위</Slider.Label>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb index={0} aria-label="최소 가격" />
          <Slider.Thumb index={1} aria-label="최대 가격" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}
