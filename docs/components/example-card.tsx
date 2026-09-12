"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { Tabs } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { IconButton } from "@/src/components/ui/icon-button";
import { Card } from "@/src/components/ui/card";
import "@/src/styles/theme.css";
import "./example-card.css";
import { getPreviewOptions } from "@/examples/preview-options";

export function ExampleCard({
  name,
  title,
  children,
}: {
  name: string;
  title: string;
  children: ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const documentTheme = resolvedTheme === "dark" ? "dark" : "light";
  const [override, setOverride] = useState<"light" | "dark">();
  const theme = override ?? documentTheme;
  const [revision, setRevision] = useState(0);
  const { minHeight, center } = getPreviewOptions(name);
  const [height, setHeight] = useState(minHeight);
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const measure = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== ref.current?.contentWindow ||
        event.data?.type !== "example-height" ||
        !Number.isFinite(event.data.height)
      )
        return;
      setHeight(Math.max(minHeight, Math.min(2400, event.data.height)));
    };
    window.addEventListener("message", measure);
    return () => window.removeEventListener("message", measure);
  }, [minHeight]);
  const src = `/preview/${name}?theme=${theme}${center ? "&layout=center" : ""}`;
  return (
    <Card
      className="docs-example not-prose"
      aria-label={`${title} 예제`}
      data-theme={documentTheme}
      data-example={name}
    >
      <Tabs.Root defaultValue="preview">
        <div className="docs-example-header">
          <Tabs.List aria-label={`${title} 보기`}>
            <Tabs.Tab value="preview">미리보기</Tabs.Tab>
            <Tabs.Tab value="code">코드</Tabs.Tab>
          </Tabs.List>
          <div className="docs-example-controls">
            <IconButton
              icon="icon-filled-arrow-spin-clockwise"
              size="sm"
              variant="utility"
              aria-label="예제 초기화"
              title="예제 초기화"
              onClick={() => {
                setHeight(minHeight);
                setRevision((value) => value + 1);
              }}
            />
            <Button
              size="sm"
              variant="utility"
              aria-label="예제 테마 전환"
              onClick={() => setOverride(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "다크" : "라이트"}
            </Button>
            <Button
              size="sm"
              variant="utility"
              nativeButton={false}
              render={<a href={src} target="_blank" rel="noreferrer" />}
            >
              새 창
            </Button>
          </div>
        </div>
        <Tabs.Panel value="preview" keepMounted>
          <iframe
            key={`${name}-${theme}-${revision}`}
            ref={ref}
            src={src}
            title={`${name} 예제`}
            loading="lazy"
            style={{ height }}
          />
        </Tabs.Panel>
        <Tabs.Panel value="code">{children}</Tabs.Panel>
      </Tabs.Root>
    </Card>
  );
}

export function ExampleCode({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("복사했습니다.");
    } catch {
      setStatus("복사하지 못했습니다. 코드를 직접 선택해 복사하세요.");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 3000);
  }
  return (
    <div className="docs-example-code">
      <div className="docs-code-header">
        <span>{title}</span>
        <Button
          size="sm"
          variant="utility"
          onClick={copy}
          aria-label="코드 복사"
        >
          복사
        </Button>
      </div>
      <div
        className="docs-code-viewport"
        role="region"
        aria-label={`${title} 코드`}
        tabIndex={0}
      >
        {children}
      </div>
      <p role="status" className="docs-copy-status">
        {status}
      </p>
    </div>
  );
}
