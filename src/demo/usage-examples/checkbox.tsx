"use client";

import { Check } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";

export function CheckboxExample() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Checkbox.Root defaultChecked>
          <Checkbox.Indicator>
            <Check size={14} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        업데이트 소식 받기
      </label>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Checkbox.Root>
          <Checkbox.Indicator>
            <Check size={14} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        마케팅 알림 받기
      </label>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Checkbox.Root disabled />
        비활성 상태
      </label>
    </div>
  );
}
