# v0.4 — 컴포넌트마다 복사할 수 있는 사용 예시

55개 컴포넌트 페이지에 **사용 예시**를 추가했습니다. 각 페이지에서 미리보기 아래로 내려가면 예제에 필요한 설치 명령, 처음 한 번 하는 설정, 컴포넌트별 설명과 전체 TSX 파일을 볼 수 있습니다.

## 페이지에서 읽는 순서

1. **미리보기**: 실제로 조작합니다.
2. **사용 예시 → 설치**: 예제에 함께 사용된 Button·Field·Icon 등의 설치 항목까지 확인합니다.
3. **처음 한 번 설정**: Base UI, 공통 CSS, 선택적 폰트, html 테마, `@/` alias를 연결합니다. Lucide를 사용하는 예제에는 추가 의존성을 표시합니다.
4. **전체 코드**: import, 가상 데이터, state, 이벤트 핸들러까지 한 파일로 복사합니다.
5. **수정 포인트**: 예제에 사용된 값·콜백·접근성 관계를 읽고 내 데이터로 바꿉니다.

기존 **소스 코드 / 스타일** 탭은 컴포넌트 자체의 구현을 보여줍니다. 새 **사용 예시**는 그 컴포넌트를 내 화면에서 사용하는 쪽의 코드입니다.

## 구조와 핵심 diff

| 파일                            | 변경                                                                        |
| ------------------------------- | --------------------------------------------------------------------------- |
| `src/demo/usage-examples/*.tsx` | 기본 55개 + 응용 3개를 독립 파일로 분리. 데이터와 helper 함수도 함께 포함   |
| `src/demo/examples/*.tsx`       | 기존 import를 유지하는 작은 re-export 파일                                  |
| `src/demo/UsageGuide.tsx`       | 실제 TSX 파일을 raw import해 표시. import에서 설치 항목을 계산              |
| `src/demo/usage-notes.json`     | 55개 컴포넌트 각각의 한국어 설명과 수정 포인트                              |
| `src/demo/App.tsx`              | 컴포넌트 페이지 아래에 UsageGuide 연결                                      |
| `src/demo/SourceBlock.tsx`      | 복사 버튼의 이름, 키보드 스크롤 가능한 코드 영역                            |
| `tests/usage.*`                 | 모든 사용 코드와 실제 파일의 일치, 설명 누락, 의존성, 복사와 응용 동작 검사 |

미리보기와 문서용 코드를 두 벌로 작성하지 않습니다. **실행 중인 예제 파일을 그대로 읽어 화면에 표시**하며, 표시할 때만 `../../components/ui/`를 문서에 설명한 `@/components/ui/`로 바꿉니다.

기존 demo 전용 `.stack`, `.demo-row` 등의 배치는 예제 내부 style로 옮겼습니다. 따라서 대상 앱에 `demo/app.css`나 Tailwind를 추가하지 않아도 됩니다. 컴포넌트의 CSS는 기존 복사 설치에 포함되고 `theme.css`는 앱 진입점에서 연결합니다.

Select, NumberField, OTP의 레이블 id는 `useId()`로 만들었습니다. 예제를 여러 번 렌더해도 같은 id가 중복되지 않습니다.

## 응용 예제

- **Button**: 비동기 처리 중 disabled/aria-busy, 성공·실패 안내.
- **Switch**: checked/onCheckedChange를 React 상태와 연결.
- **Sidebar**: Provider/Panel/Trigger를 조합해 모바일 모달과 데스크톱 패널을 같은 코드로 사용.

기본 예제 안에도 크기·역할·비활성 상태, 폼 제출, 메뉴 선택, 다이얼로그 열림 제어 등의 조합이 있습니다. 이 목록이 모든 prop 조합을 뜻하지는 않습니다.

## 검증

- `npm run build`: TypeScript + 레지스트리 + Vite 빌드 통과.
- `npm test`: 5개 통과. 기존 설치 검사와 55개 문서/독립 예제 검사.
- `npm run test:ui`: 17개 통과. 55개 기본 예제 렌더링, 실제 파일과 표시 코드 비교, 클립보드 복사, 스위치 상태 제어, 버튼 처리 중 상태, 기존 UI 회귀 및 접근성 검사.
- 별도 `work/usage-consumer`에 UI 파일114개와 **화면에 표시하는 import 경로로 변환한 예제58개**를 복사해 TypeScript 검사 통과.
- 390px 모바일 수평 넘침 검사. 긴 코드는 Tab으로 포커스한 뒤 키보드로 스크롤할 수 있습니다.

문서 앱은 모든 예제와 구현 소스를 함께 제공하므로 Vite 번들 크기 알림이 남아 있습니다. 이 문서 코드와 사용 예제는 컴포넌트 복사 설치에 포함되지 않습니다. 필요할 때 화면에서 복사하거나 usage-examples 폴더에서 가져옵니다.

문서 구성 참고: [shadcn/ui Button의 Installation·Usage·Examples](https://ui.shadcn.com/docs/components/base/button). 예제 코드는 이 키트의 실제 API로 독립 작성했습니다.
