# 문서와 예제 구조

## 변경 목적

Vite 단일 화면에 섞여 있던 문서, 예제, 배포 소스를 분리했습니다. 제목과 설명은 대상의 이름, 용도, 동작, 조건을 기준으로 작성합니다.

## 역할

- `src/components/ui`, `src/styles`: 소비자 프로젝트에 복사할 소스입니다. Next.js, Fumadocs, Storybook 의존성이 없습니다.
- `examples`: 실행 가능한 React 예제입니다. `index.ts`는 미리보기의 지연 로딩 연결, `manifest.json`은 컴포넌트 이름과 분류입니다.
- `docs/content`: MDX 문서가 제목, 설명, 검색 별칭, 본문을 소유합니다.
- `docs/components`: 문서 전용 UI입니다. 예제와 코드 영역을 조합합니다.
- `app/preview/[name]`: 예제를 iframe이나 새 창에서 실행합니다. Base UI 스타일과 문서 스타일이 같은 DOM에서 섞이지 않습니다.
- `stories`: 동일 예제를 import합니다. Button/Input은 실제 props를 Controls에 연결합니다. 공통 테마 도구는 모든 사례에 적용됩니다.

## 예제와 표시 코드

`ComponentExample`은 검증된 예제 이름만 받습니다. 서버에서 실제 파일을 읽고 Shiki로 구문을 강조합니다. 상대 UI 경로만 소비자 프로젝트의 `@/components` 경로로 바꿉니다. 조합 예제의 형제 TSX/CSS 의존 파일도 함께 표시합니다.

iframe은 준비된 클라이언트에서 예제를 렌더합니다. ResizeObserver가 콘텐츠 높이를 전달하고, 부모는 origin과 발신 프레임이 일치하는 메시지만 받습니다. 모달은 예제 프레임 안에서 표시되며, 전체 뷰포트 검증은 새 창에서 합니다.

## 검색

`/api/search`는 빌드 때 MDX의 제목, 설명, 별칭, 본문으로 정적 JSON을 만듭니다. 검색창을 처음 열 때 로드하고 이후 재사용합니다. 실패하면 오류와 재시도 버튼을 표시합니다.

순서는 정확한 이름·별칭, 접두어, 부분 일치, 자모 접두어, 본문입니다. 초성 입력은 제목과 별칭만 검색하여 본문의 우연한 일치를 줄입니다. 형태소 분석이나 의미 검색은 하지 않습니다.

## 타입 문서와 상태 비교

`auto-type-table`은 컴포넌트의 타입과 JSDoc에서 속성표를 생성합니다. `docs/lib/api-generator.ts`는 외부 React/HTML 속성을 걸러냅니다. Select는 `SelectProps`와 `SelectOption`을 문서화하고, Menu.Popup과 Dialog.Popup처럼 자식 컴포넌트에 속성이 있는 경우에는 각 자식의 타입을 연결합니다. 설명과 `@defaultValue`는 컴포넌트 타입 선언에서 수정합니다.

`stories/components/variant-matrix.tsx`는 Button/Input의 크기·종류·상태를 비교하는 공통 표입니다. Storybook의 Controls와 조합표가 선택지 배열을 공유합니다.

예제 오류는 `ExampleBoundary`가 iframe 안에서 처리합니다. 재로딩 버튼은 iframe 문서를 새로 로드해 실패한 지연 import도 다시 시도합니다. 비교 근거와 적용 범위는 `SEED-REVIEW.md`에 기록했습니다.

## 새 컴포넌트 추가

1. `src/components/ui`에 컴포넌트와 CSS를 작성합니다.
2. `examples`에 실행 예제를 추가하고 `manifest.json`에 컴포넌트를 등록합니다. 예제 파일은 `컴포넌트-경우.tsx`, 대표 export는 파일명에 대응하는 `PascalCaseExample`로 지정합니다.
3. `docs/content/components`에 MDX를 작성하고 `meta.json`에 순서를 지정합니다.
4. `pnpm examples:build`로 지연 import 목록, 서버 허용 목록, `stories/generated`를 생성합니다. MDX의 ComponentExample이 보조 사례를 등록하므로 별도로 목록을 관리하지 않습니다.
5. `pnpm registry:build`, `pnpm typecheck`, 관련 검사를 실행합니다.

## 실행과 배포

pnpm 11.9.0과 pnpm-lock.yaml을 사용합니다. `pnpm build`는 레지스트리, Storybook, Next.js를 순서대로 빌드합니다. `scripts/build-storybook.mjs`가 성공한 결과를 `public/storybook`에 복사하며, Next.js가 문서와 Storybook을 같은 출처에서 제공합니다. `/storybook`은 상대 자산 경로를 유지하는 `/storybook/index.html`로 이동합니다. Vercel 설정은 `vercel.json`에 기록합니다.

`pnpm dev`는 Storybook을 한 번 빌드하고 문서 서버를 시작합니다. 별도 `pnpm storybook` 개발 서버는 문서 관련 경로를 5173 서버로 전달합니다. Storybook의 Vite `publicDir`와 `staticDirs`를 비워 빌드 결과의 재귀 복사를 방지합니다. 두 빌드 폴더는 Git에서 제외합니다.

## 이전 자료

`history`는 당시 상태를 기록한 자료입니다. 이전 경로와 npm 명령은 현재 실행 안내가 아닙니다. 현재 명령은 루트 README를 따릅니다.

## 예제 UI와 문서 순서

예제마다 우리 Tabs, Button, IconButton, Card로 미리보기와 코드 전환을 구성합니다. 코드 탭으로 이동해도 프레임을 유지하며 초기화할 때만 새 프레임을 만듭니다. 팝업 예제는 `examples/preview-options.ts`에서 열릴 공간을 확보합니다.

복합 컴포넌트의 역할은 구성 표에 요약하고, 로컬 속성은 자식 이름별로 표시합니다. 각 종류와 상태는 독립적인 설명과 예제를 갖습니다. 단일 요소에 불필요한 구성 표를 만들지 않습니다.

`examples/index.ts`, `examples/names.ts`, `stories/generated`는 생성 파일입니다. 수정할 곳은 예제 TSX와 MDX입니다. 개발 서버를 켠 상태에서 새 파일을 추가했을 때는 `pnpm examples:build`를 실행합니다. dev, build, typecheck, storybook 명령 시작 시에도 생성합니다.
