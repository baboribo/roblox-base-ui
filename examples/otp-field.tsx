"use client";
import { useId } from "react";

import { OTPField } from "../src/components/ui/otp-field";

export function OTPExample() {
  const fieldId = useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <label htmlFor={fieldId}>인증 코드</label>
      <OTPField.Root id={fieldId} length={6}>
        {Array.from({ length: 6 }, (_, i) => (
          <OTPField.Input key={i} aria-label={`코드 ${i + 1}번째 자리`} />
        ))}
      </OTPField.Root>
    </div>
  );
}
