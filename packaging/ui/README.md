# PLY UI

로블록스의 시각적 스타일을 바탕으로 웹 제품에 맞게 구현한 React UI입니다. Roblox 공식 패키지가 아닙니다.

패키지 이름은 `ply-ui`입니다. React 컴포넌트와 타입, CSS를 제공합니다.

## 소스를 내 프로젝트에 추가

Node.js 22 이상, pnpm, React 19 + TypeScript 프로젝트에서 실행합니다.

```sh
pnpm dlx ply-ui add button select
```

TSX·CSS와 필요한 내부 컴포넌트를 복사하고, Base UI를 설치하며 공통 스타일을 시작 파일에 연결합니다. Next.js App Router와 Vite를 감지합니다. `src` 구조는 `src/components/ui`, 루트 `app` 구조는 `components/ui`에 추가합니다. 설치 경로는 `ply-ui.json`에 저장합니다.

```sh
pnpm dlx ply-ui list
pnpm dlx ply-ui add --all
pnpm dlx ply-ui add button --dry-run
pnpm dlx ply-ui add button --cwd ../my-app --src src --entry src/main.tsx
```

시작 파일이 모호하면 `--entry`로 지정합니다. 다른 내용의 기존 파일을 만나면 쓰기 전에 중단합니다. `--overwrite`는 공통 파일을 포함해 교체하며, `--no-install`은 의존성 설치만 생략하고 `--no-setup`은 소스만 복사합니다. 다시 실행해도 동일 파일과 스타일 import를 중복으로 추가하지 않습니다.

복사한 소스는 내 프로젝트에서 직접 관리합니다. 이후 npm 패키지를 업데이트해도 복사본은 자동으로 바뀌지 않습니다.

## 패키지로 설치해서 사용

React 19 프로젝트에서 `pnpm add ply-ui`로 설치합니다. 로컬 패키지를 검증할 때는 `pnpm add /절대/경로/패키지.tgz`로 설치할 수 있습니다.

```tsx
import { Button, Select } from "ply-ui";
import "ply-ui/styles.css";

export function Settings() {
  return (
    <>
      <Select
        label="공개 범위"
        options={[
          { value: "public", label: "전체 공개" },
          { value: "private", label: "비공개" },
        ]}
        defaultValue="public"
      />
      <Button>저장</Button>
    </>
  );
}
```

`styles.css`는 앱 진입점에서 한 번 불러옵니다. 컴포넌트별 CSS는 JavaScript와 함께 로드됩니다. 필요한 컴포넌트만 가져오려면 `import { Select } from "ply-ui/select"`처럼 개별 경로를 사용할 수 있습니다.

Next.js App Router에서는 `app/layout.tsx`에서 `styles.css`를 불러옵니다. 상태와 이벤트를 사용하는 화면에는 `"use client"`를 지정합니다. 패키지 내부 컴포넌트의 클라이언트 지시문은 유지됩니다.

## 테마와 폰트

`html`에 `data-theme="light"` 또는 `data-theme="dark"`를 지정합니다. 패키지 CSS 다음에 사용자 CSS를 불러와 토큰을 덮어씁니다.

```css
:root {
  --rbx-font-body: "Pretendard", system-ui, sans-serif;
}
```

폰트 파일은 포함하지 않으며 기본적으로 외부 폰트를 요청하지 않습니다. 기존 Roblox CDN 폰트 연결이 필요한 경우에만 `ply-ui/fonts.css`를 따로 불러옵니다.

## 구성과 출처

React와 React DOM은 사용하는 앱이 제공합니다. Base UI는 패키지 의존성으로 설치됩니다. Next.js, Fumadocs, Storybook과 문서 예제는 포함되지 않습니다.

토큰과 기본 아이콘은 기존 프로젝트에서 기록한 Roblox 공개 CSS를 바탕으로 합니다. 컴포넌트 동작은 Base UI 위에 별도로 구현했습니다. PLY가 직접 작성한 코드는 MIT 라이선스로 제공합니다. 제3자 자료의 출처와 적용 범위는 `THIRD_PARTY_NOTICES.md`를 참고하세요.
