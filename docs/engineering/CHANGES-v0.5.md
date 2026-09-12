# v0.5 문서 구조 변경

## 변경 내용

Vite의 단일 데모 화면을 Next.js와 Fumadocs 문서로 옮겼습니다. 55개 컴포넌트마다 주소, 설치 명령, 실행 예제, 사용법, 원본 코드를 제공합니다.

- `src/demo`의 예제는 `examples`로 이동했습니다. 문서와 Storybook이 같은 파일을 실행하고, 문서는 해당 파일을 읽어 사용 코드로 표시합니다.
- 컴포넌트 설명은 용도·동작·조건으로 정리했습니다. API 이름은 유지하고, 메뉴와 문서 도구는 한국어로 표시합니다.
- Storybook에 55개 컴포넌트와 추가 상태를 포함한 63개 사례를 연결했습니다. Button과 Input은 Controls로 실제 props를 바꿀 수 있습니다.
- 검색은 MDX 제목·별칭·본문을 사용합니다. `버튼`, `ㅂㅌ`, `Button`을 모두 지원하며, es-hangul로 초성과 자모를 처리합니다.
- 컴포넌트 미리보기는 별도 iframe에서 실행합니다. 문서 테마와 예제 테마를 각각 변경할 수 있습니다.
- pnpm 11.9.0과 `pnpm-lock.yaml`로 설치를 통일했습니다. 현재 실행 안내와 복사 CLI의 안내도 pnpm을 사용합니다.

## 수정할 위치

설명은 `docs/content`, 실행 예제는 `examples`, 상태별 사례는 `stories`, 실제 컴포넌트는 `src/components/ui`에서 수정합니다. 공통 스타일은 `src/styles/theme.css`에서 수정합니다.

Fumadocs의 기본 번역 키에는 사용 위치도 포함됩니다. `docs/lib/translations.ts`는 라이브러리 타입으로 키를 검사합니다.

## 검증 범위

검사는 복사 설치·내부 의존성, 토큰 참조, 실제 예제와 표시 코드의 일치, 한글 검색, 키보드 조작, 모바일 탐색, 테마 분리, 다이얼로그 배경과 포커스 복귀를 포함합니다. Storybook 검사는 63개 사례의 실제 렌더링과 Button Controls 적용을 확인합니다.

실행 명령은 루트 README의 검증 절을 따릅니다. 문서와 Storybook을 같은 사이트에 배포하며, 상단 링크는 `/storybook`입니다. 이전의 `NEXT_PUBLIC_STORYBOOK_URL` 설정은 사용하지 않습니다.
