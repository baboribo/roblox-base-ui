import type { ComponentType } from "react";
import { SourceBlock } from "./SourceBlock";
import notes from "./usage-notes.json";
import { SwitchControlledExample } from "./usage-examples/switch-controlled";
import { SidebarResponsiveExample } from "./usage-examples/sidebar-responsive";
import { ButtonLoadingExample } from "./usage-examples/button-loading";

// The preview and the displayed code come from the same TSX file.
const sources = import.meta.glob("./usage-examples/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
type Note = { intro: string; tips: string[] };
const extraExamples: Record<
  string,
  { id: string; title: string; description: string; Example: ComponentType }
> = {
  switch: {
    id: "switch-controlled",
    title: "상태를 직접 관리하기",
    description:
      "checked와 onCheckedChange로 스위치 값을 React 상태에 연결합니다.",
    Example: SwitchControlledExample,
  },
  sidebar: {
    id: "sidebar-responsive",
    title: "반응형 탐색 조합",
    description:
      "1141px 이상에서는 패널, 좁은 화면에서는 버튼으로 여는 모달입니다.",
    Example: SidebarResponsiveExample,
  },
  button: {
    id: "button-loading",
    title: "처리 중인 버튼",
    description:
      "로컬 비동기 예제입니다. 처리 중에는 중복 클릭을 막고 결과를 알립니다.",
    Example: ButtonLoadingExample,
  },
};
function exampleSource(id: string) {
  const source = sources[`./usage-examples/${id}.tsx`];
  if (!source) throw new Error(`Missing usage example: ${id}`);
  // The only presentation transform is the documented src alias.
  return source.replaceAll('"../../components/ui/', '"@/components/ui/');
}
export function UsageGuide({ id }: { id: string }) {
  const code = exampleSource(id);
  const note = (notes as Record<string, Note>)[id];
  const extra = extraExamples[id];
  const allCode = code + (extra ? exampleSource(extra.id) : "");
  const components = [
    ...new Set(
      [...allCode.matchAll(/@\/components\/ui\/([\w-]+)/g)].map(
        (match) => match[1],
      ),
    ),
  ];
  const needsLucide = allCode.includes('from "lucide-react"');
  return (
    <section className="usage-guide" aria-labelledby={`usage-title-${id}`}>
      <div className="usage-heading">
        <span className="eyebrow">USAGE</span>
        <h2 id={`usage-title-${id}`}>사용 예시</h2>
        <p>{note.intro}</p>
      </div>
      <ol className="usage-steps">
        <li>
          <strong>예제에 필요한 컴포넌트 설치</strong>
          <SourceBlock
            label="키트 폴더에서 실행"
            code={`npm run ui -- add ${components.join(" ")} --cwd /absolute/path/to/my-app`}
          />
          <p>
            이미 설치했다면 생략합니다. 예제에서 함께 쓰는 부품도 포함한
            명령입니다.
          </p>
        </li>
        <li>
          <strong>프로젝트 연결 — 처음 한 번</strong>
          <details className="usage-setup">
            <summary>Base UI · 공통 CSS · import 경로 설정</summary>
            <SourceBlock
              label="대상 프로젝트에서 실행"
              code={`npm install @base-ui/react@1.8.0${needsLucide ? " lucide-react" : ""}`}
            />
            <SourceBlock
              label="src/main.tsx (Next.js: src/app/layout.tsx에서 ../styles/theme.css)"
              code={
                'import "./styles/theme.css";\n// 선택: import "./styles/fonts.css";\n// html에 data-theme="dark" 또는 "light"를 지정합니다.'
              }
            />
            <p>
              <code>@/</code>는 <code>src/</code> alias입니다. 아래 파일을{" "}
              <code>src/examples/</code>에 저장하고 alias가 없다면{" "}
              <code>@/components/</code>를 <code>../components/</code>로
              바꾸세요.
            </p>
          </details>
          {needsLucide && (
            <p>
              이 예제의 보조 아이콘에는 <code>lucide-react</code>도 필요합니다.
              복사되는 UI 컴포넌트 자체의 필수 의존성은 아닙니다.
            </p>
          )}
        </li>
        <li>
          <strong>예제를 복사하고 값과 동작 바꾸기</strong>
          <ul className="usage-tips">
            {note.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <SourceBlock
            label={`src/examples/${id}.tsx · 위 미리보기의 전체 코드`}
            code={code}
          />
          <p>
            데이터·상태·import까지 포함한 파일입니다. export된 예제 함수를 내
            페이지에 렌더하세요. 배치는 파일 안의 style에 있어 별도 데모 CSS가
            필요하지 않습니다.
          </p>
        </li>
      </ol>
      {extra && (
        <section className="usage-extra" aria-label={extra.title}>
          <h3>{extra.title}</h3>
          <p>{extra.description}</p>
          <div className="usage-extra-preview">
            <extra.Example />
          </div>
          <SourceBlock
            label={`src/examples/${extra.id}.tsx`}
            code={exampleSource(extra.id)}
          />
        </section>
      )}
    </section>
  );
}
