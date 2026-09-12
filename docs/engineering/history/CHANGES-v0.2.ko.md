# v0.2 — 실측에 맞춰 바뀐 부분

단순 색상 교체에서 실제 Default 웹의 크기·상태·표면을 맞추는 단계로 변경했습니다. 기준은 현재 화면에서 확인한 Foundation Web이며, Account info·Security·Chat·Robux FAQ의 규칙을 반영했습니다.

| 항목               | 이전 v0.1                               | 현재 v0.2                                                         |
| ------------------ | --------------------------------------- | ----------------------------------------------------------------- |
| Button 기본        | standard / medium                       | emphasis / large                                                  |
| Small Button       | 높이 32, 글자 14, 좌우 12               | 높이 32, 글자 12, line-height 12, 좌우 8                          |
| 버튼 크기          | 간격·폰트 추정                          | XS 24/12, SM 32/12, MD 40/14, LG 48/16                            |
| Disabled 강조 버튼 | 강조색 × 0.45                           | standard 역할로 교체 × 0.5                                        |
| Input              | surface 배경, 추정 테두리               | 투명, contrast-alpha 테두리, 24/32/40/48                          |
| Menu/Select popup  | surface200, radius8, 단일 그림자        | surface100, radius16, transient-high 그림자                       |
| Dialog             | 고정 480, padding28, 기본 테두리        | 320/480/640, Body/Footer 16/20, muted 테두리                      |
| Switch             | 44×26, 파란 트랙, 흰 손잡이, 150ms 이동 | 40×24 medium, contrast 트랙, inverse 손잡이+체크, flex-grow 300ms |
| Checkbox / Radio   | 파란색 선택                             | contrast/sub-emphasis 선택 + inverse 표시                         |
| Focus              | 파란 2px                                | selection-start 3px, offset3                                      |
| Accordion          | 밑줄형 + 높이 애니메이션                | Robux FAQ 카드형, 40px 질문 행, 즉시 펼침                         |
| 아이콘/폰트        | Lucide 예제 + 회사 폰트 URL             | 새 예제는 원본 glyph27 + 현재 웹 Builder Sans                     |
| 테마               | 추가 palette17 + corporate 선택         | Default light/dark만 생성·노출                                    |
| Account Status     | 미구현                                  | 4칸 Meter, 상태 카드, 가로 카드 컬렉션                            |
| Help 목록          | 공통 목록만                             | inset/boxed 구분선 변형                                           |
| 설치               | CSS 의존성만 추적                       | TSX/CSS 상대 import를 재귀 추적                                   |

## 1. 먼저 Button을 읽기

`button.tsx`의 기본값이 `data-variant`, `data-size`로 전달됩니다. `button.css`의 크기표가 높이와 글자 크기를 정하고, 공통 hover/press/focus는 `theme.css`가 담당합니다. 색상 토큰의 border 값이 있어도 현재 웹 버튼은 `border: 0`입니다.

작은 버튼의 글자 크기가 2px만 달라도 원본보다 크게 보입니다. 이번 수정은 이런 오차를 개별 규칙으로 줄였습니다.

## 2. Input의 외곽과 실제 input 구분

`leading`/`trailing`이 없으면 Base UI Input 하나만 렌더링합니다. 아이콘이 있으면 `rbx-input-group`이 테두리·배경을 맡고 input은 입력 역할에 집중합니다. `controlSize`는 높이, native `size`는 글자 수이므로 이름을 분리했습니다. disabled opacity가 부모·자식에 두 번 곱해지지 않도록 처리했습니다.

```tsx
<Input
  controlSize="sm"
  leading={<Icon name="icon-filled-magnifying-glass" size={16} />}
  aria-label="검색"
  placeholder="Search"
/>
```

## 3. Dialog의 여백을 눈에 보이게 분리

`Popup size="md"`가 너비 480을 정하고 `Body`가 20px 여백을 줍니다. Footer는 좌우·아래에 20px을 쓰고 위쪽은 Body와 중복하지 않습니다. `CloseAffordance`는 별도 닫기 버튼이며 키보드 포커스 처리는 Base UI Close가 맡습니다. 기존처럼 Popup 내부를 직접 구성하는 API도 유지합니다.

## 4. Chat은 데이터와 UI를 분리

`chat.tsx`에는 인증·HTTP·WebSocket이 없습니다. 소비자가 목록 데이터와 콜백을 전달합니다. 따라서 아바타나 텍스트를 바꾸면서 같은 286/260px 패널 규칙을 연습할 수 있습니다. 데모는 합성 데이터이며 그룹 생성 콜백을 생략했습니다. 실제 Roblox 그룹 Create는 누르지 않았습니다.

## 5. 원본 색상과 대비 보정은 명시적으로 선택

원본 alert/link 역할을 그대로 쓰면 일부 작은 글자의 자동 대비 검사에 실패할 수 있습니다. 기본값은 실측·배포 색상을 유지합니다. 향후 서비스에 적용하면서 보정하고 싶으면 html에 `data-contrast="enhanced"`를 넣으세요. dark/light alert와 dark link 전경만 별도로 보정합니다. 이 보정은 Roblox 원본 테마라고 표시하지 않습니다.

## 확인하지 못한 범위

원본의 모든 UI/상태/화면을 복제한 것은 아닙니다. Default 테마 카드 썸네일과 합성 아바타는 예제용이고, Slider 등 이번에 직접 측정하지 않은 컴포넌트는 기존 Base UI 구현입니다. 전체 픽셀 비교, 원본 모바일 앱, 계정 변경이 필요한 흐름, 수동 스크린리더 감사, Next.js SSR 전체 통합은 미검증입니다.

## 6. Switch: transform 대신 flex-grow

private server의 새 Toggle은 손잡이 양쪽에 빈 span을 놓고 flex-grow를 번갈아 0/1로 바꿉니다. 이 구조를 Base UI Switch.Root 안에서 그대로 표현했습니다. 크기는 xs 28×16/손잡이12, sm 32×20/16, md 40×24/20, lg 44×24/20입니다. 원본 서버의 두 스위치는 변경하지 않았고, 꺼짐 규칙은 공개 배포 코드에서 확인했습니다. 로컬 예제에서 켜짐/꺼짐·색·체크·RTL·reduced motion을 검증합니다.
