import { SourceBlock } from "../SourceBlock";

export function InstallPage() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">OWN YOUR COMPONENTS</span>
        <h1>복사하고, 읽고, 바꾸세요.</h1>
        <p>
          컴포넌트 소스가 내 프로젝트 안에 남습니다. 런타임 UI 패키지는 Base
          UI만 사용합니다.
        </p>
      </div>
      <div className="guide">
        <h2>01 · 프로젝트에서 시작</h2>
        <p>
          이 키트의 폴더에서 실행합니다. 상대 경로는 이 키트 폴더 기준입니다.
        </p>
        <SourceBlock
          label="터미널"
          code={
            "npm run ui -- list\nnpm run ui -- add button dialog --cwd /absolute/path/to/my-app --src src\n\n# 모든 컴포넌트 복사\nnpm run ui -- add --all --cwd /absolute/path/to/my-app --src src"
          }
        />
        <p>
          대상 앱에는 <code>npm install @base-ui/react@1.8.0</code>을
          실행하세요. 기존 파일은 기본적으로 덮어쓰지 않습니다.
        </p>
        <h2>02 · 스타일은 앱의 진입점에서</h2>
        <SourceBlock
          label="React main.tsx / Next.js app/layout.tsx"
          code={
            'import "./styles/theme.css";\n// 경로는 진입점 위치에 맞게 조정하세요. Next app/layout.tsx라면 ../styles/theme.css\n// Builder 폰트를 원하면 styles/fonts.css도 가져옵니다.\n\n// html에 data-theme="dark" 또는 "light"를 지정하세요.\nimport { Button } from "./components/ui/button";\n\n<Button variant="emphasis">계속하기</Button>'
          }
        />
        <h2>03 · 한 번에 하나씩 수정</h2>
        <div className="learning-grid">
          <article>
            <b>전체 테마</b>
            <code>styles/theme.css</code>
            <p>색상·글꼴·공통 포커스 스타일을 바꿉니다.</p>
          </article>
          <article>
            <b>한 컴포넌트의 모양</b>
            <code>components/ui/button.css</code>
            <p>버튼만 바꾸고 싶을 때 여기서 시작합니다.</p>
          </article>
          <article>
            <b>API와 조합 방식</b>
            <code>components/ui/button.tsx</code>
            <p>props가 Base UI로 전달되는 과정을 읽습니다.</p>
          </article>
        </div>
        <SourceBlock
          label="theme.css 끝에 추가"
          code={
            ":root {\n  --rbx-light-mode-system-emphasis: #6c21c6;\n  --rbx-dark-mode-system-emphasis: #9348f0;\n  --rbx-radius-medium: 12px;\n}"
          }
        />
        <h2>04 · shadcn 레지스트리로 설치</h2>
        <p>
          이 키트에서 <code>npm run dev</code>를 실행한 상태에서, shadcn 설정이
          있는 대상 프로젝트에서 사용하세요. 파일 대상 경로는 <code>src/</code>
          입니다.
        </p>
        <SourceBlock
          label="대상 프로젝트의 터미널"
          code={"npx shadcn@latest add http://127.0.0.1:5173/r/sidebar.json"}
        />
        <p>
          자세한 구조와 제약은 README와 docs/ARCHITECTURE.ko.md에 정리했습니다.
        </p>
      </div>
    </>
  );
}
