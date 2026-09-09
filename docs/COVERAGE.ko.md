# 컴포넌트 대응표

구현 파일 55종: Base UI 기반 및 조합 45종, 의미 있는 HTML 조합 10종.
각 항목은 로컬 앱에서 미리보기와 실제 TSX/CSS를 확인할 수 있습니다.
이 목록은 **이 키트의 범위**이며 Roblox 내부 전체 컴포넌트 목록이 아닙니다.

| 파일                  | 동작 기반                                       | 예제 렌더링   |
| --------------------- | ----------------------------------------------- | ------------- |
| `accordion.tsx`       | `@base-ui/react/accordion`                      | Chromium 확인 |
| `alert-dialog.tsx`    | `@base-ui/react/alert-dialog`                   | Chromium 확인 |
| `alert.tsx`           | Semantic HTML                                   | Chromium 확인 |
| `autocomplete.tsx`    | `@base-ui/react/autocomplete`                   | Chromium 확인 |
| `avatar.tsx`          | `@base-ui/react/avatar`                         | Chromium 확인 |
| `badge.tsx`           | Semantic HTML                                   | Chromium 확인 |
| `breadcrumb.tsx`      | Semantic HTML                                   | Chromium 확인 |
| `button.tsx`          | `@base-ui/react/button`                         | Chromium 확인 |
| `card.tsx`            | Semantic HTML                                   | Chromium 확인 |
| `checkbox-group.tsx`  | `@base-ui/react/checkbox-group`                 | Chromium 확인 |
| `checkbox.tsx`        | `@base-ui/react/checkbox`                       | Chromium 확인 |
| `collapsible.tsx`     | `@base-ui/react/collapsible`                    | Chromium 확인 |
| `combobox.tsx`        | `@base-ui/react/combobox`                       | Chromium 확인 |
| `context-menu.tsx`    | `@base-ui/react/context-menu`                   | Chromium 확인 |
| `dialog.tsx`          | `@base-ui/react/dialog`                         | Chromium 확인 |
| `drawer.tsx`          | `@base-ui/react/drawer`                         | Chromium 확인 |
| `empty.tsx`           | Semantic HTML                                   | Chromium 확인 |
| `field.tsx`           | `@base-ui/react/field`                          | Chromium 확인 |
| `fieldset.tsx`        | `@base-ui/react/fieldset`                       | Chromium 확인 |
| `form.tsx`            | `@base-ui/react/form`                           | Chromium 확인 |
| `input.tsx`           | `@base-ui/react/input`                          | Chromium 확인 |
| `menu.tsx`            | `@base-ui/react/menu`                           | Chromium 확인 |
| `menubar.tsx`         | `@base-ui/react/menubar`                        | Chromium 확인 |
| `meter.tsx`           | `@base-ui/react/meter`                          | Chromium 확인 |
| `navigation-menu.tsx` | `@base-ui/react/navigation-menu`                | Chromium 확인 |
| `number-field.tsx`    | `@base-ui/react/number-field`                   | Chromium 확인 |
| `otp-field.tsx`       | `@base-ui/react/otp-field`                      | Chromium 확인 |
| `popover.tsx`         | `@base-ui/react/popover`                        | Chromium 확인 |
| `preview-card.tsx`    | `@base-ui/react/preview-card`                   | Chromium 확인 |
| `progress.tsx`        | `@base-ui/react/progress`                       | Chromium 확인 |
| `radio-group.tsx`     | `@base-ui/react/radio-group`                    | Chromium 확인 |
| `radio.tsx`           | `@base-ui/react/radio`                          | Chromium 확인 |
| `scroll-area.tsx`     | `@base-ui/react/scroll-area`                    | Chromium 확인 |
| `select.tsx`          | `@base-ui/react/select`                         | Chromium 확인 |
| `separator.tsx`       | `@base-ui/react/separator`                      | Chromium 확인 |
| `skeleton.tsx`        | Semantic HTML                                   | Chromium 확인 |
| `slider.tsx`          | `@base-ui/react/slider`                         | Chromium 확인 |
| `switch.tsx`          | `@base-ui/react/switch`                         | Chromium 확인 |
| `table.tsx`           | Semantic HTML                                   | Chromium 확인 |
| `tabs.tsx`            | `@base-ui/react/tabs`                           | Chromium 확인 |
| `textarea.tsx`        | Semantic HTML                                   | Chromium 확인 |
| `toast.tsx`           | `@base-ui/react/toast`                          | Chromium 확인 |
| `toggle-group.tsx`    | `@base-ui/react/toggle-group`                   | Chromium 확인 |
| `toggle.tsx`          | `@base-ui/react/toggle`                         | Chromium 확인 |
| `toolbar.tsx`         | `@base-ui/react/toolbar`                        | Chromium 확인 |
| `tooltip.tsx`         | `@base-ui/react/tooltip`                        | Chromium 확인 |
| `typography.tsx`      | Semantic HTML                                   | Chromium 확인 |
| `status-meter.tsx`    | Base UI Meter + Semantic HTML                   | Chromium 확인 |
| `carousel.tsx`        | Base UI ScrollArea/Button 조합                  | Chromium 확인 |
| `chat.tsx`            | Base UI Button/Input/Checkbox 조합              | Chromium 확인 |
| `icon.tsx`            | Semantic HTML + CSS mask                        | Chromium 확인 |
| `icon-button.tsx`     | `@base-ui/react/button`                         | Chromium 확인 |
| `list.tsx`            | Semantic HTML + Base UI Button                  | Chromium 확인 |
| `sidebar.tsx`         | Base UI Dialog/ScrollArea + NavigationItem 조합 | Chromium 확인 |
| `navigation-item.tsx` | Base UI Button/useRender + Icon                 | Chromium 확인 |

## 대응 방식

- Button은 Foundation action 9종(emphasis, standard, soft-emphasis, sub-emphasis, subtle, utility, over-media, alert, link)과 크기 4종을 노출합니다.
- 나머지 복합 컴포넌트는 `Root`, `Trigger`, `Portal`, `Positioner`, `Popup` 등 Base UI의 파트 구조를 따릅니다. 원본 export를 보존하므로 기본값뿐 아니라 controlled 상태를 연결할 수 있습니다.
- 체크박스/스위치/토글은 상태 속성으로 스타일을 바꿉니다.
- Field/Form은 Base UI의 검증 메시지와 입력 연결을 사용합니다.
- Card/Badge/Table/Breadcrumb/Alert/Empty/Skeleton/Textarea/Typography는 DOM 의미를 갖춘 HTML 조합입니다.
- `DirectionProvider`, `CSPProvider` 같은 설정 도구는 Base UI에서 직접 가져오세요. 스타일 컴포넌트로 재포장하지 않았습니다.
- 원본 API 중 스타일을 별도로 연결하지 않은 파트도 Base UI export 그대로 사용할 수 있습니다. 복합/중첩 메뉴, 다중 combobox, 모든 orientation/size/disabled 조합까지 별도 스타일 완성을 보장하지는 않습니다.

## 검증의 강도

전체 55종의 기본 예제 렌더링과 런타임 예외를 검사합니다. 주요 폼/모달/선택/슬라이더/메뉴의 실제 상호작용, 버튼 페이지의 light/dark 및 추가 11개 예제의 자동 접근성, 390px 모바일 폭을 추가 검사합니다. 렌더링 통과만으로 모든 파트와 상태가 검증되었다고 해석하지 마세요.

## 원본과의 대응 강도 (v0.3)

| 범위                      | 확인한 근거                                                       | 아직 같다고 주장하지 않는 부분                       |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| Button, IconButton, Badge | 배포 JS size/variant 매핑 + 실제 DOM                              | 모든 inverse/selected 조합                           |
| Input, Select/Menu        | Browser preferences, Account info, Chat 실측                      | 모든 validation/복합 selection 조합                  |
| Dialog                    | Account info 이름 편집창 실측 + 배포 크기 규칙                    | 모든 확인·에러·보안 워크플로                         |
| Switch                    | private server 실측 + ConfigurePrivateServer 배포 size/state 규칙 | 원본 서버 설정 변경 흐름                             |
| Checkbox, Radio           | Chat 선택박스, Account info 라디오 실측                           | 원본 모든 레이블 배치                                |
| Chat                      | 286/260 × 360, 헤더·검색·행·푸터·glyph                            | 원본 아바타, 실제 대화방/읽음 처리/네트워크          |
| Accordion/FAQ             | Robux FAQ 실측 + RobuxRedesign 배포 JS                            | FAQ의 원문·구매 관련 기능                            |
| List, inverse Popover     | Security 목록, Communities 안내 팝오버                            | 모든 목록 레이아웃/프로모션 UX                       |
| Status Meter / Carousel   | Account Status 실측 + Base UI 조합                                | 실제 제재 정보, 원본 학습 일러스트, carousel 세부 UX |
| Sidebar / Navigation Item | Home 실측 + Navigation 배포 CSS/JS                                | 모바일 모달 동작·검색·문서 분류는 키트 확장          |
| 나머지 컴포넌트           | 기존 공개 토큰 + Base UI 독립 구현                                | 실제 Roblox 최신 화면과의 시각 동등성                |

Button의 9가지 API 중 `sub-emphasis`, `subtle`, `over-media`는 기존 토큰 대응을 유지한 확장입니다. 이번 Foundation Web 텍스트 Button에서 확인한 주요 역할은 emphasis, standard, soft-emphasis, utility, link, alert입니다. 메뉴는 기본 medium, Select 예제는 large이며 각 Popup의 size를 명시할 수 있습니다.
