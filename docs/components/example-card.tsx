"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const documentTheme = resolvedTheme === "dark" ? "dark" : "light";
  const [override, setOverride] = useState<"light" | "dark">();
  const theme = override ?? documentTheme;
  const [revision, setRevision] = useState(0);
  const { minHeight, center } = getPreviewOptions(name);
  const [height, setHeight] = useState(minHeight);
  const src = `/preview/${name}?theme=${theme}${center ? "&layout=center" : ""}`;
  // 테마를 모르는 동안 light 예제를 먼저 요청하지 않습니다.
  if (!mounted || !resolvedTheme) {
    return (
      <div
        className="docs-example-pending"
        style={{ minHeight }}
        aria-busy="true"
        aria-label={`${title} 예제 준비 중`}
      />
    );
  }
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
            <Tabs.Indicator />
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
        <Tabs.Panels>
          <Tabs.Panel value="preview" keepMounted>
            <ExampleFrame
              key={`${name}-${revision}`}
              name={name}
              theme={theme}
              center={center}
              height={height}
              minHeight={minHeight}
              onHeight={setHeight}
            />
          </Tabs.Panel>
          <Tabs.Panel value="code">{children}</Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>
    </Card>
  );
}

function ExampleFrame({
  name,
  theme,
  center,
  height,
  minHeight,
  onHeight,
}: {
  name: string;
  theme: "light" | "dark";
  center: boolean;
  height: number;
  minHeight: number;
  onHeight: (height: number) => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  // src는 최초 로딩 때만 정합니다. 이후 테마 변경은 입력값을 유지한 채 적용합니다.
  const [src] = useState(
    () => `/preview/${name}?theme=${theme}${center ? "&layout=center" : ""}`,
  );
  const applyTheme = () => {
    const root = ref.current?.contentDocument?.documentElement;
    if (root) root.dataset.theme = theme;
  };
  useLayoutEffect(applyTheme, [theme]);
  useEffect(() => {
    const measure = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== ref.current?.contentWindow ||
        event.data?.type !== "example-height" ||
        !Number.isFinite(event.data.height)
      )
        return;
      onHeight(Math.max(minHeight, Math.min(2400, event.data.height)));
    };
    window.addEventListener("message", measure);
    return () => window.removeEventListener("message", measure);
  }, [minHeight, onHeight]);
  return (
    <iframe
      ref={ref}
      src={src}
      title={`${name} 예제`}
      loading="lazy"
      style={{ height }}
      onLoad={applyTheme}
    />
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
