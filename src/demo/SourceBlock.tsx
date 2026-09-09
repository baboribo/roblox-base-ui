import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../components/ui/button";

export function CopyButton({
  text,
  label = "복사",
}: {
  text: string;
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2200);
    return () => clearTimeout(timer);
  }, [state]);
  return (
    <Button
      aria-label={label}
      size="sm"
      variant="utility"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState("done");
        } catch {
          setState("failed");
        }
      }}
    >
      {state === "done" ? <Check size={14} /> : <Copy size={14} />}
      <span role="status">
        {state === "done" ? "복사됨" : state === "failed" ? "복사 실패" : label}
      </span>
    </Button>
  );
}
export function SourceBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="source-block">
      <div className="source-heading">
        <span>{label}</span>
        <CopyButton text={code} />
      </div>
      <pre tabIndex={0} role="region" aria-label={`${label} 코드`}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
