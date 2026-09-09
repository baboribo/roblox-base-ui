"use client";
import type { ComponentProps, ReactNode } from "react";
import { Meter } from "@base-ui/react/meter";
import { cx, withClassName } from "../../lib/cx";
import "./status-meter.css";
export type StatusMeterProps = Omit<
  ComponentProps<typeof Meter.Root>,
  "children" | "min" | "max"
> & {
  label: string;
  startLabel?: string;
  endLabel?: string;
  tone?: "success" | "warning" | "alert" | "emphasis";
};
/** Account Status에서 본 4칸 표시. 숫자 값의 의미와 문구는 소비자가 정합니다. */
export function StatusMeter({
  value,
  label,
  tone = "success",
  startLabel,
  endLabel,
  className,
  ...props
}: StatusMeterProps) {
  const normalized = Math.min(
    4,
    Math.max(0, Number.isFinite(value) ? value : 0),
  );
  return (
    <Meter.Root
      {...props}
      value={normalized}
      min={0}
      max={4}
      aria-label={label}
      data-tone={tone}
      className={withClassName("rbx-status-meter", className)}
    >
      <div className="rbx-status-segments" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} data-filled={index < normalized || undefined} />
        ))}
      </div>
      {(startLabel || endLabel) && (
        <div className="rbx-status-labels" aria-hidden="true">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}
    </Meter.Root>
  );
}
export function StatusCard({
  title,
  children,
  className,
  ...props
}: Omit<ComponentProps<"section">, "title"> & { title: ReactNode }) {
  return (
    <section {...props} className={cx("rbx-status-card", className)}>
      <h2 className="rbx-status-card-title">{title}</h2>
      {children}
    </section>
  );
}
