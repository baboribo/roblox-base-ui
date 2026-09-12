"use client";
import { useState, type CSSProperties } from "react";
import { Button } from "../src/components/ui/button";

const motionStyles = `.motion-demo {
  display: grid;
  gap: 24px;
}
.motion-demo-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.motion-demo-controls select {
  padding: 8px;
  margin-inline-start: 8px;
  border: 1px solid var(--rbx-color-stroke-default);
  border-radius: 8px;
  color: inherit;
  background: var(--rbx-color-surface-200);
}
.motion-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
}
.motion-demo-item {
  display: grid;
  gap: 12px;
}
.motion-demo-item svg {
  height: 112px;
  max-width: 100%;
  color: var(--rbx-color-content-link);
}
.motion-demo-item code {
  font-size: 11px;
}
.motion-demo-track {
  height: 24px;
  padding-inline-end: 24px;
  background: var(--rbx-color-shift-100);
  border-radius: 4px;
}
.motion-demo-track span {
  display: block;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  background: var(--rbx-color-content-link);
  position: relative;
}
.motion-demo-track span[data-playing] {
  animation: motion-demo-travel var(--demo-duration) var(--demo-ease) both;
}
@keyframes motion-demo-travel {
  from {
    left: 0;
  }
  to {
    left: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .motion-demo-track span[data-playing] {
    animation: none;
    left: 100%;
  }
}
`;

const curves = [
  {
    name: "등장",
    token: "--rbx-ease-standard-out",
    curve: "0.2, 0, 0, 1",
    path: "M0 100 C20 100 0 0 100 0",
  },
  {
    name: "퇴장",
    token: "--rbx-ease-standard-in",
    curve: "0.8, 0, 0.4, 1",
    path: "M0 100 C80 100 40 0 100 0",
  },
  {
    name: "일정한 속도",
    token: "--rbx-ease-linear",
    curve: "0, 0, 1, 1",
    path: "M0 100 L100 0",
  },
];
export function MotionExample() {
  const [run, setRun] = useState(0);
  const [duration, setDuration] = useState("200");
  return (
    <div className="motion-demo">
      <style>{motionStyles}</style>
      <div className="motion-demo-controls">
        <label>
          재생 시간{" "}
          <select
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          >
            {[100, 200, 300, 500, 1000].map((ms) => (
              <option key={ms} value={ms}>
                {ms}ms{ms === 1000 ? " · 곡선 비교용" : ""}
              </option>
            ))}
          </select>
        </label>
        <Button onClick={() => setRun((value) => value + 1)}>다시 재생</Button>
      </div>
      <div className="motion-demo-grid">
        {curves.map((curve) => (
          <div className="motion-demo-item" key={curve.token}>
            <strong>{curve.name}</strong>
            <svg
              viewBox="-8 -8 120 124"
              role="img"
              aria-label={`${curve.name} 속도 곡선. 가로축은 시간, 세로축은 진행률입니다.`}
            >
              <path
                d="M0 0V100H100"
                fill="none"
                stroke="currentColor"
                opacity=".3"
              />
              <path
                d={curve.path}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
            <code>cubic-bezier({curve.curve})</code>
            <div className="motion-demo-track">
              <span
                key={`${run}-${duration}`}
                data-playing={run > 0 || undefined}
                style={
                  {
                    "--demo-duration": `var(--rbx-time-${duration})`,
                    "--demo-ease": `var(${curve.token})`,
                  } as CSSProperties
                }
              />
            </div>
          </div>
        ))}
      </div>
      <p>
        가로축은 시간, 세로축은 진행률입니다. 운영체제에서 움직임 감소를
        설정하면 이동 없이 끝 위치를 표시합니다.
      </p>
    </div>
  );
}
