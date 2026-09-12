"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { examples, type ExampleName } from "./index";
import manifest from "./manifest.json";
import { ExampleBoundary } from "../docs/components/example-boundary";
export function ExampleRenderer({
  name,
  theme = "light",
  layout,
}: {
  name: string;
  theme?: "light" | "dark";
  layout?: "center";
}) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setReady(true);
  }, [theme]);
  useEffect(() => {
    if (!ready || !ref.current) return;
    const send = () =>
      parent.postMessage(
        { type: "example-height", height: ref.current!.scrollHeight + 48 },
        location.origin,
      );
    const observer = new ResizeObserver(send);
    observer.observe(ref.current);
    send();
    return () => observer.disconnect();
  }, [ready]);
  const Example = examples[name as ExampleName];
  const title = manifest.find((x) => x.id === name)?.name ?? name;
  return (
    <main className="preview-root" aria-label={`${title} 예제`}>
      <h1 className="sr-only">{title} 예제</h1>
      <div className="preview-content" data-layout={layout} ref={ref}>
        {ready ? (
          <ExampleBoundary key={name}>
            <Suspense fallback={<p role="status">예제 불러오는 중</p>}>
              <Example />
            </Suspense>
          </ExampleBoundary>
        ) : (
          <p role="status">예제 불러오는 중</p>
        )}
      </div>
    </main>
  );
}
