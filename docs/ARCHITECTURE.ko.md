# 설계와 핵심 로직

## 이번 변경의 출발점

v0.1에서 토큰 기반 라이브러리를 만들었고, v0.2에서는 로그인된 웹을 읽기 전용으로 조사해 시각 규칙을 수정했습니다. 실제 변경 전후는 [CHANGES-v0.2.ko.md](CHANGES-v0.2.ko.md)에 정리했습니다. 목표는 복사한 TSX와 CSS를 읽고 직접 바꿀 수 있게 하는 것입니다.

## 1. 디자인의 값과 동작을 분리

```text
Roblox의 공개 CSS
       ↓ 변수 선언만 추출, 원본 URL/해시 기록
roblox.snapshot.json
       ↓ --rbx- 접두사, light/dark 선택자 연결
styles/tokens.css
       ↓ 내가 바꿀 CSS 규칙
styles/theme.css + components/ui/*.css
       ↓ 모양을 가진 React 컴포넌트
@base-ui/react의 상태 · ARIA · 키보드 · 포커스
```

원본 번들 JS는 실행하거나 라이브러리로 복사하지 않습니다. CSS 변수, 공개 SVG glyph, 배포된 크기·역할 매핑을 확인하고, 그 값을 브라우저 DOM에 연결하는 React 컴포넌트를 구현했습니다. 그래서 Roblox 내부의 API와 이 키트 API가 같다고 주장하지 않습니다.

`tokens.css`의 기본 변수 636개와 light/dark 의미 변수는 원본 이름을 유지합니다. `--color-extended-blue-700`은 `--rbx-color-extended-blue-700`으로 바뀝니다. 내부 var 참조도 함께 바뀌므로 연결이 끊기지 않습니다. 토큰 생성 테스트는 참조 대상이 모두 존재하는지 확인합니다.

Default light/dark만 생성합니다. Classic과 유료 팔레트는 스냅샷의 theme 규칙과 생성 CSS에서 제외했습니다. Corporate 데이터는 조사 기록에만 남기고 실행 테마에는 섞지 않습니다.

## 2. Button: 가장 먼저 읽을 파일

`variant`와 `size`는 시각적 의미만 표현합니다.

```tsx
<Button variant="emphasis" size="md">
  계속하기
</Button>
```

1. `button.tsx`는 variant를 `data-variant`로, size를 `data-size`로 전달합니다.
2. `button.css`는 `[data-variant="emphasis"]`를 선택합니다.
3. background와 foreground를 action 토큰에서 읽습니다. 현재 Foundation Web 텍스트 버튼은 border가 0입니다.
4. 클릭 처리, disabled 처리, `render` 합성은 Base UI Button이 맡습니다.

이것이 전체 컴포넌트의 기본 패턴입니다. 커다란 styled factory나 숨겨진 코드 생성 런타임을 사용하지 않습니다. 반복되는 짧은 컴포넌트는 의도적으로 파일 안에 드러냈습니다.

## 3. className을 그냥 문자열로 합치면 생기는 문제

Base UI의 className은 문자열뿐 아니라 상태를 받는 함수일 수 있습니다.

```tsx
<Button className={(state) => (state.disabled ? "my-disabled" : "my-active")} />
```

문자열 배열에 이 함수를 그대로 넣으면 함수 자체가 텍스트로 변환됩니다. `withClassName`은 Base UI가 전달한 상태로 함수를 실행한 뒤 기본 클래스와 합칩니다. props와 ref는 가로채지 않고 전달합니다. Root처럼 제네릭 값을 다루는 파트는 Base UI 원본 export를 보존합니다.

## 4. Dialog를 하나의 거대한 컴포넌트로 만들지 않은 이유

- `Root`: 열림 상태. `defaultOpen` 또는 `open/onOpenChange`를 선택합니다.
- `Trigger`: 열기. `render`로 Button과 합성할 수 있습니다.
- `Portal`: body 밑에 표시해 부모 overflow 문제를 피합니다.
- `Backdrop`: 뒤쪽 표면을 가립니다.
- `Popup`: 대화상자, focus trap, 키보드 동작을 담당합니다.
- `Body` / `Footer`: small은 16px, medium/large는 20px 여백을 분리합니다.
- `CloseAffordance`: Account info에서 확인한 36px 원형 닫기 버튼입니다.
- `Title` / `Description`: 보조 기술에 목적을 설명합니다.
- `Close`: 닫기와 트리거로의 포커스 복귀를 연결합니다.

소비자가 파트를 조합할 수 있어 입력 폼, 확인창, 읽기 패널을 같은 원리로 만들 수 있습니다. theme 속성은 html에 둬야 Portal도 동일한 색상과 폰트를 상속합니다. 임의의 중첩 테마 컨테이너를 자동 전파하는 Provider는 현재 없습니다.

## 5. 공통 CSS와 개별 CSS의 경계

여러 컴포넌트가 같은 입력창, 버튼, 팝업, 설명 텍스트 표면을 사용하므로 공통 규칙은 `theme.css`에 있습니다. 개별 파일은 해당 컴포넌트만의 차이와 추가 커스터마이징 지점입니다. 따라서 `dialog.css`처럼 짧은 파일도 정상입니다. 팝업의 공통 규칙은 `theme.css`에서 읽으면 됩니다.

독립 복사에서도 필요한 스타일을 놓치지 않도록 CSS의 상대 `@import`와 TSX의 상대 `import`를 재귀적으로 수집합니다. 예: meter는 progress의 막대 스타일, collapsible은 accordion의 패널 스타일을 함께 가져옵니다.

## 6. 설치와 레지스트리

`registry-lib.mjs`가 실제 파일을 읽는 하나의 기준입니다. 자체 CLI와 shadcn JSON이 같은 파일 목록을 사용합니다. 예제의 TSX를 복사하는 것이 아니라 `components/ui`의 실제 라이브러리를 복사합니다.

설치 순서:

1. 이름, 경로, 옵션을 검증합니다.
2. TSX/CSS 의존 파일과 공통 파일을 재귀적으로 수집합니다.
3. 모든 대상 파일의 충돌을 검사합니다.
4. 충돌이 없을 때 디렉터리를 만들고 복사합니다.

쓰기 전에 충돌을 확인하므로, 이미 수정한 버튼이 있다면 새 다이얼로그만 반쯤 설치되는 상황을 피합니다. 다만 디스크 장애까지 되돌리는 파일시스템 트랜잭션은 아닙니다. `--overwrite`를 명시한 교체는 사용자가 요청한 파일을 바꿉니다.

## 7. 학습용 예제의 상태

데모의 프로젝트 저장·삭제는 React state로 결과를 보여주는 예시이며 외부 서버에 연결되지 않습니다. 라이브러리의 Form과 Dialog는 실제 업무 API에 묶이지 않으므로, 소비하는 앱에서 onSubmit/onOpenChange를 연결합니다.

입력은 label, 선택은 listbox/combobox, 확인창은 alertdialog를 사용합니다. 클릭만 되는 div로 접근성 동작을 다시 구현하지 않습니다. reduced-motion에서는 전환과 애니메이션을 끕니다.

## 8. Chat과 FAQ를 읽는 순서

`ChatDock`은 대화 목록 데이터와 콜백만 받습니다. 검색·접기는 React 상태로, 버튼·입력·체크박스는 Base UI로 처리합니다. `ChatGroupPanel`의 생성 콜백은 선택 사항이며, 데모에서는 연결하지 않아 Create가 계속 비활성입니다. 실제 계정 데이터와 서버 호출은 없습니다.

`Accordion`은 Robux FAQ의 시각 규칙을 따릅니다. 원본의 클릭 가능한 div 대신 Base UI Trigger를 사용해 키보드·ARIA 관계를 유지했습니다. 여러 항목을 동시에 펼칠 수 있고, 원본 코드에 없던 높이 애니메이션을 넣지 않습니다. 질문과 답변 텍스트는 소비자가 제공합니다.

## 9. 측정과 추정을 섞지 않기

`tokens/default-web.measurements.json`은 계정 정보 없이 CSS 속성만 저장합니다. 테스트는 이 파일과 로컬 컴포넌트의 계산된 스타일을 비교합니다. 파일의 `samples`는 실제 dark 화면에서 측정한 값이고, light는 공개 Default 토큰에서 도출했습니다. 원본에 접근하지 못한 컴포넌트는 Base UI와 토큰으로 구현한 범위이며 완전 복제라고 부르지 않습니다.

## v0.3 탐색 조합

[사이드바 구조와 diff](CHANGES-v0.3.ko.md)를 먼저 읽어보세요. NavigationItem/Button과 NavigationLink/anchor가 시각 파트를 공유하고 Sidebar가 이를 IconButton·ScrollArea·Dialog와 조합합니다. 실제 BLOCK/UI App도 같은 컴포넌트를 사용합니다. 경로와 검색 상태는 App, 반응형 열림과 포커스는 Sidebar/Base UI, 시각 값은 각 CSS에 있습니다.

## v0.4 실행 예제와 문서 코드의 일치

컴포넌트별 usage-examples TSX를 실행과 raw 코드 표시에 함께 사용합니다. usage-notes.json은 설명만 보관합니다. UsageGuide가 현재 예제의 import를 읽어 설치 명령과 추가 의존성을 표시합니다. 자세한 파일 역할은 [CHANGES-v0.4.ko.md](CHANGES-v0.4.ko.md)에 있습니다.
