"use client";
import { useState } from "react";
import { Button } from "../src/components/ui/button";

export function ButtonLoadingExample() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  async function save() {
    setSaving(true);
    setMessage("");
    try {
      // 이 지연을 내 저장 API 호출로 교체하세요.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setMessage("저장했습니다.");
    } catch {
      setMessage("저장하지 못했습니다. 다시 시도하세요.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Button disabled={saving} aria-busy={saving} onClick={save}>
        {saving ? "저장 중…" : "저장"}
      </Button>
      <p role="status">{message}</p>
    </div>
  );
}
