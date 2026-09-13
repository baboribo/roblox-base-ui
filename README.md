# PLY UI

Base UI 기반 React 컴포넌트 55종과 디자인 토큰입니다. 컴포넌트 파일을 프로젝트에 복사해 사용합니다. 문서는 Fumadocs, 상태 비교는 Storybook으로 제공합니다.

Roblox의 공개 CSS와 화면을 참고한 독립 구현입니다. 공식 패키지나 내부 디자인 시스템 전체의 복제본은 아닙니다.

## 실행

Node.js 22 이상, pnpm 11.9.0을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

문서: http://127.0.0.1:5173/docs

Storybook: http://127.0.0.1:5173/storybook

`pnpm dev`는 Storybook을 한 번 빌드한 뒤 문서 서버를 시작합니다. 같은 주소의 Storybook을 갱신하려면 `pnpm storybook:build`를 실행합니다.

컴포넌트 수정 내용을 즉시 확인하려면 별도 터미널에서 실행합니다.

```sh
pnpm storybook
```

Storybook 개발 서버: http://localhost:6006

개발 서버의 예제에서 문서로 이동하려면 5173 문서 서버도 실행 중이어야 합니다.

## npm 패키지

```sh
pnpm add ply-ui
```

```tsx
import "ply-ui/styles.css";
import { Button } from "ply-ui/button";
```

React 19를 사용합니다. `html`에 `data-theme="light"` 또는 `data-theme="dark"`를 지정합니다. 패키지의 스타일·타입·개별 컴포넌트 경로를 제공합니다. 자세한 사용법은 [패키지 README](packaging/ui/README.md), 배포 작업은 [배포 안내](docs/engineering/PACKAGE-RELEASE.md)를 참고하세요.

## 소스를 프로젝트에 복사

가져올 대상 React 19 + TypeScript 프로젝트 안에서 실행합니다. 저장소를 따로 받을 필요가 없습니다.

```sh
pnpm dlx ply-ui add button select
pnpm dlx ply-ui list
pnpm dlx ply-ui add --all --dry-run
```

TSX·CSS·공통 토큰과 내부 의존 컴포넌트를 복사하고, Base UI 설치와 시작 파일의 스타일 연결까지 처리합니다. Next.js App Router와 Vite를 자동 감지합니다. 다른 구조는 `--entry`로 시작 파일을 지정합니다. 선택한 경로는 `ply-ui.json`에 보관합니다.

수정한 파일과 충돌하면 쓰기 전에 중단합니다. `--overwrite`는 공통 파일까지 교체하므로 변경 내용을 확인한 뒤 사용합니다. `--no-setup`은 소스만 복사합니다. 저장소 개발 중에는 동일한 도구를 `pnpm ui add button --cwd ../my-app`으로 실행할 수 있습니다.

```tsx
import { Button } from "./components/ui/button";

export function SubmitButton() {
  return <Button type="submit">저장</Button>;
}
```

`fonts.css`는 선택 사항입니다. Roblox 공개 글꼴 URL을 참조하며 글꼴 파일을 포함하지 않습니다. Lucide를 사용하는 예제는 `pnpm add lucide-react`가 추가로 필요합니다.

복사 CLI는 내부 의존 파일을 함께 복사합니다. 변경된 파일이 이미 있으면 쓰기 전에 중단합니다. `--overwrite`를 지정하면 기존 수정본도 교체하므로 변경 사항을 먼저 비교합니다.

## 레지스트리

```sh
pnpm registry:build
pnpm dlx shadcn@latest add http://127.0.0.1:5173/r/button.json
```

`public/r/`는 생성 결과입니다. 원본 컴포넌트를 수정한 뒤 다시 생성합니다. 문서나 Storybook의 의존성은 복사 대상에 포함되지 않습니다.

## 구조

| 경로                          | 역할                                  |
| ----------------------------- | ------------------------------------- |
| `src/components/ui`           | 배포할 컴포넌트와 CSS                 |
| `src/styles`, `tokens`        | 테마, 생성 토큰, 원본 기록            |
| `examples`                    | 문서와 Storybook이 공유하는 실행 예제 |
| `stories`, `.storybook`       | 상태별 사례와 Storybook 설정          |
| `docs/content`                | MDX 사용 문서                         |
| `docs/components`, `docs/lib` | 문서 UI와 검색                        |
| `app`                         | Next.js 경로                          |
| `scripts`                     | 설치·토큰·레지스트리 도구             |
| `tests`                       | 기능, 접근성, 설치 검증               |
| `docs/engineering`            | 개발 구조와 변경 기록                 |

컴포넌트 이름은 API의 영문 이름을 유지합니다. 설명은 용도·동작·조건·제약을 기준으로 작성합니다. 제목과 메뉴에 슬로건을 사용하지 않습니다.

## 문서 예제 추가

`examples/컴포넌트-경우.tsx`에 독립 예제를 작성하고 MDX에 `<ComponentExample name="컴포넌트-경우" title="설명 제목" />`를 넣습니다. `pnpm examples:build`가 미리보기 목록과 같은 컴포넌트의 Storybook 사례를 생성합니다. `examples/index.ts`, `examples/names.ts`, `stories/generated`는 직접 편집하지 않습니다.

## 검색

MDX에서 정적 검색 데이터를 생성합니다. 브라우저에서 이름, 한국어 별칭, 초성, 본문을 검색합니다. 이름·별칭 일치를 본문 일치보다 우선합니다. es-hangul은 자모 분해와 초성 추출에 사용합니다. 형태소 분석과 의미 검색은 제공하지 않습니다.

## 검증과 빌드

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:ui
pnpm storybook:build
pnpm test:storybook
```

UI 검사는 빌드된 문서를 5174 포트에서 실행합니다. 개발 서버와 포트가 겹치지 않습니다.

## 배포

`pnpm build`는 설치용 레지스트리, Storybook, Next.js 문서를 순서대로 빌드합니다. `pnpm start`로 실행하면 같은 사이트에서 `/docs`와 `/storybook`을 사용할 수 있습니다. `/storybook`은 상대 경로가 유지되도록 `/storybook/index.html`로 이동합니다.

Vercel은 `vercel.json`의 Next.js 프리셋과 `pnpm build`를 사용합니다. Output Directory는 Next.js 기본값이며 `dist`를 지정하지 않습니다. Git 연결 프로젝트에서는 푸시할 때 두 화면을 함께 배포합니다. 별도 Storybook 주소나 `NEXT_PUBLIC_STORYBOOK_URL`은 필요하지 않습니다.

`storybook-static/`은 Storybook 원본 빌드 결과, `public/storybook/`은 문서 서버가 제공할 복사본입니다. 둘 다 Git에서 제외하고 빌드 때 생성합니다. Storybook은 `public/`을 다시 복사하지 않습니다. 예제 이미지는 import나 data URI를 사용합니다.

## 범위

Default 라이트·다크 테마를 제공합니다. 예제의 저장은 React 상태 변경이며 서버 저장, 인증 코드 검증, 메시지 전송은 연결하지 않았습니다. 과거 자료와 검증 기록은 `docs/engineering/history/`에 보관합니다. 해당 기록의 이전 경로와 npm 명령은 당시 상태를 설명합니다.
