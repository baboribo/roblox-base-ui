# PLY UI

로블록스의 시각적 스타일을 바탕으로 웹 제품에 맞게 구현한 React UI입니다. Roblox 공식 패키지가 아닙니다.

패키지 이름은 `ply-ui`입니다. React 컴포넌트와 타입, CSS를 제공합니다.

## 설치와 사용

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
