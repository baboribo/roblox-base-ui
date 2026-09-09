# Roblox Base UI — 소유하고 수정하는 컴포넌트 키트

Roblox 웹 **Default 테마의 실측값과 공개 배포 CSS에서 추출한 디자인 토큰**을 `@base-ui/react`에 연결한 React/TypeScript 라이브러리입니다. shadcn처럼 컴포넌트 파일을 내 앱으로 복사하고 직접 수정합니다.

**내부 전체 디자인 시스템의 원본 복제본은 아닙니다.** 내부 WebBlox 저장소는 HTTP 421로 접근하지 못했습니다. 버튼·입력·메뉴·다이얼로그·라디오·Chat·FAQ는 실제 화면과 배포 코드를 확인해 개선했습니다. 동작은 Base UI로 구현했고, 원본 전체와 픽셀 단위 동등성을 검증한 것은 아닙니다. 자세한 출처·미확인 범위는 [SOURCES.ko.md](docs/SOURCES.ko.md)를 읽어주세요.

## 바로 실행

이 README가 있는 폴더에서:

```sh
npm ci
npm run dev
```

로컬 문서 앱은 **55종**의 동작, 실제 TSX/CSS, **Default light/dark**, 토큰 검색과 조합 예제를 제공합니다. [Default 웹 예제](http://127.0.0.1:5173/#default-web)에서 설정·Chat·FAQ를 함께 볼 수 있습니다. Classic·유료 테마는 생성 CSS와 테마 선택 UI에서 제외했습니다. 회사/Plus 페이지는 별도 참고 기록입니다.

이번 변경을 먼저 읽으려면 [v0.4 사용 예시 구조와 변경 설명](docs/CHANGES-v0.4.ko.md)을 보세요.

## 내 React / Next.js 프로젝트에 복사

먼저 대상 프로젝트 폴더가 존재해야 합니다. 이 키트의 폴더에서:

```sh
npm run ui -- list
npm run ui -- add button dialog --cwd /absolute/path/to/my-app --src src
npm run ui -- add --all --cwd /absolute/path/to/my-app --src src
```

- `--cwd`는 **대상 앱의 루트**입니다. 상대 경로는 명령을 실행한 폴더 기준입니다.
- `--src src`가 기본값입니다. `--src .`이면 앱 루트 아래에 `components`, `lib`, `styles`가 생깁니다.
- `.tsx`, `.css`, 공통 토큰, 유틸리티, TSX/CSS 의존 파일을 함께 복사합니다.
- 동일 파일은 유지하고, 달라진 기존 파일이 하나라도 있으면 **쓰기 전에 전체 작업을 중단**합니다. 의도한 교체에만 `--overwrite`를 쓰세요.
- `--dry-run`으로 복사될 경로를 먼저 볼 수 있습니다.
- 대상 앱의 패키지, 설정, 진입점은 자동 변경하지 않습니다.

대상 앱에서:

```sh
npm install @base-ui/react@1.8.0
```

React 19 + TypeScript를 기준으로 검증했습니다. Radix, MUI Material, Uber의 `baseui`를 사용하지 않습니다. 여기서 Base UI는 **`@base-ui/react`** 입니다. Lucide는 이 키트의 데모에서만 사용하며 복사된 라이브러리는 아이콘 패키지를 요구하지 않습니다.

Vite/React의 `src/main.tsx`:

```tsx
import "./styles/theme.css";
// 선택: Roblox 공개 폰트 URL을 사용합니다. 오프라인이면 시스템 폰트로 대체됩니다.
import "./styles/fonts.css";
```

Next.js App Router의 `src/app/layout.tsx`:

```tsx
import "../styles/theme.css";
import "../styles/fonts.css"; // 선택 사항

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
```

Vite는 `index.html`의 `<html>`에 `data-theme="dark"` 또는 `light`를 넣으세요. **테마는 html에 적용하세요.** 모달과 메뉴가 body로 Portal을 만들기 때문에, 중간 div에만 테마를 지정하면 Portal이 테마를 이어받지 못합니다. 서버 렌더링 시에도 초기 html 속성을 동일하게 지정하세요.

사용 예:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export function EditButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="emphasis" />}>
        프로젝트 편집
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup size="md">
          <Dialog.CloseAffordance aria-label="닫기" />
          <Dialog.Body>
            <Dialog.Title>프로젝트 편집</Dialog.Title>
            <Dialog.Description>원하는 설정으로 변경하세요.</Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button size="md" />}>완료</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

`@/`는 대상 프로젝트에서 `src/`로 연결된 alias가 있을 때 사용합니다. alias가 없으면 상대 경로를 사용하세요. `render`를 사용하면 DOM 버튼을 중첩하지 않고 스타일과 동작을 합성합니다. 링크 버튼은 `render={<a href="..." />}`와 `nativeButton={false}`를 함께 지정합니다.

## shadcn CLI로도 추가

이 키트에서:

```sh
npm run registry:build
npm run dev -- --port 5173 --strictPort
```

shadcn 설정이 있는 대상 앱에서:

```sh
npx shadcn@latest add http://127.0.0.1:5173/r/button.json
# 사이트 탐색
npx shadcn@latest add http://127.0.0.1:5173/r/sidebar.json
# 전체
npx shadcn@latest add http://127.0.0.1:5173/r/all.json
```

레지스트리는 `registry-item.json` 규격이며 `~/src/` 경로를 명시합니다. 다른 소스 경로가 필요하면 위의 자체 복사 CLI를 쓰세요. 토큰 CSS import와 html 테마 설정은 위 설명대로 추가합니다. 소스 수정 후에는 `npm run registry:build`로 JSON을 다시 생성합니다. 외부 서비스에는 배포하지 않았습니다.

## 어디부터 읽으면 좋을까요?

```text
src/
  styles/
    tokens.css        ← 원본 토큰에서 생성. 보통 직접 수정하지 않음
    theme.css         ← 내 브랜드를 만드는 첫 수정 지점 + 공통 UI 스타일
    fonts.css         ← 선택적 원격 폰트
  components/ui/
    button.tsx        ← props를 Base UI로 전달하는 얇은 컴포넌트
    button.css        ← 버튼의 variant와 size
    dialog.tsx        ← Root, Portal, Popup 등 조합 가능한 파트
    dialog.css        ← 크기, Body/Footer 여백, CloseAffordance
    sidebar.tsx       ← NavigationItem/ScrollArea/Dialog를 조합한 실제 사이트 탐색
    navigation-item.tsx ← 버튼과 링크가 공유하는 탐색 행
    chat.tsx          ← 합성 가능한 ChatDock와 ChatGroupPanel
    icon.tsx          ← 공개 배포 CSS의 glyph를 감싼 컴포넌트
    ...               ← 컴포넌트마다 TSX/CSS를 한 쌍으로 분리
  lib/cx.ts           ← className 문자열·상태 함수를 모두 보존
  demo/               ← 학습용 앱. 대상 프로젝트에는 복사하지 않음
    usage-examples/   ← 컴포넌트별 복사 가능한 전체 예제 55개 + 응용 3개
    usage-notes.json   ← 각 예제의 한국어 설명과 수정 포인트
    pages/            ← 토큰 / 설치 / 출처 / 조합 페이지
    examples/         ← 입력 / 오버레이 / 탐색 / 표시 예제를 분리
scripts/
  add.mjs             ← 충돌 검사 후 복사
  registry-lib.mjs    ← 파일 의존성 수집
  build-registry.mjs  ← 실제 소스에서 레지스트리 생성
  build-tokens.mjs    ← 원본 스냅샷에서 CSS 생성
  extract-tokens.mjs  ← 저장한 공개 CSS에서 스냅샷 재현
tokens/
  roblox.snapshot.json ← URL·수집일·SHA256·원본 이름과 값
  catalog.json         ← 구현한 컴포넌트 목록
  default-web.measurements.json ← 실제 측정값과 파일 해시
```

다음으로 [설계와 핵심 로직](docs/ARCHITECTURE.ko.md), [컴포넌트 대응표](docs/COVERAGE.ko.md)를 읽어보세요.

## 컴포넌트별 사용 예시

각 컴포넌트 페이지의 미리보기 아래 **사용 예시**에 설치, 설정, import와 전체 코드, 수정 포인트가 있습니다. 화면에서 실행하는 TSX를 그대로 표시하므로 예제 파일을 수정하면 문서 코드도 함께 바뀝니다. Button·Switch·Sidebar에는 추가 응용 예제도 있습니다. 자세한 구조는 [v0.4 변경 설명](docs/CHANGES-v0.4.ko.md)을 읽어보세요.

## 작은 수정 연습

1. `button.tsx`에서 `variant`가 `data-variant`가 되는 것을 읽습니다.
2. `button.css`에서 그 속성으로 action 토큰을 선택하는 부분을 찾습니다.
3. `theme.css` 끝에 아래를 추가합니다.

```css
:root {
  --rbx-light-mode-system-emphasis: #6c21c6;
  --rbx-dark-mode-system-emphasis: #9348f0;
  --rbx-radius-medium: 12px;
}
```

4. 강조 버튼과 입력의 포커스 색이 함께 바뀌는지 봅니다. 체크박스·라디오의 선택 색은 `system-contrast` 및 `action-sub-emphasis` 역할이므로 강조색과 별도로 바뀝니다.

색상 토큰은 **기본 팔레트 → light/dark 의미 → 컴포넌트 action**으로 이어집니다. 중간의 올바른 역할을 바꾸면 여러 컴포넌트를 동시에 바꿀 수 있습니다.

## 검증

```sh
npm test                 # 복사/덮어쓰기 방지/레지스트리/토큰 참조
npm run typecheck
npm run build
npx playwright install chromium
npm run test:ui          # Chromium 인터랙션, 접근성, 모바일 폭
```

전체 카탈로그를 한 화면에서 전환하고 실제 소스를 보여주므로 데모 번들은 일반 앱보다 큽니다. 대상 앱에는 선택한 컴포넌트만 복사됩니다. 전수 픽셀 비교, 스크린리더 수동 감사, 모든 브라우저/입력 장치 조합, Next.js SSR 통합은 별도 검증 범위입니다.

상세 검증 결과: [VERIFICATION.ko.md](docs/VERIFICATION.ko.md).
