# 컴포넌트 문서 개편

Button 시안에서 확인한 예제 간격과 미리보기/코드 탭을 전체 컴포넌트 문서에 적용했습니다. 역할은 구성 표로 요약하고, 로컬 속성은 구성 요소별 제목으로 표시합니다.

## 변경 구조

- `docs/components/example-card.tsx`: 우리 Card, Tabs, Button, IconButton으로 예제 UI를 구성합니다. 코드 탭에서도 iframe을 유지하고 초기화 시에만 재생성합니다.
- `docs/components/example.tsx`: 실제 예제 TSX를 읽어 미리보기와 같은 소스를 표시합니다.
- `examples/preview-options.ts`: 일반 예제와 팝업 예제에 필요한 공간을 구분합니다.
- `scripts/build-examples.mjs`: 실제 export와 MDX를 읽어 지연 import, 서버 허용 목록, 보조 Storybook 사례를 생성합니다.
- `stories/generated`: 문서의 보조 예제입니다. 원본 TSX 또는 MDX를 수정한 뒤 재생성합니다.

## 설명 기준

크기·종류·상태를 독립 예제로 표시합니다. 복합 컴포넌트의 구성 표는 부모와 자식의 역할, 상태를 지정할 위치를 설명합니다. 단일 요소에는 불필요한 구성 표를 추가하지 않습니다.

Select의 Trigger와 Popup은 각각 size를 받으며 기본값이 lg입니다. Menu.Popup의 기본값은 md입니다. Checkbox의 md와 lg는 현재 같은 24px입니다. Button의 sub-emphasis와 over-media는 같은 색상 토큰을 사용합니다. 이런 차이와 중복도 문서에 적었습니다.

Select.Trigger, Select.Popup, Menu.Popup, Checkbox.Root, Dialog.Popup, Popover.Popup, List.Root, List.Content에 로컬 속성 타입을 추가했습니다. 실행 기본값과 CSS는 유지했습니다.

Combobox의 입력 이름은 native label과 useId로 연결합니다. Base UI의 Combobox.Label은 Trigger용이므로 입력 이름 연결에 사용하지 않습니다.

## 적용 범위

55개 컴포넌트의 사용 문서와 예제 UI를 개편했습니다. 사이트 탐색 영역은 기존 Fumadocs Notebook 구성입니다. 자체 컴포넌트로 구성한 문서 예제 UI와 사이트의 전체 탐색 UI는 별개입니다.
