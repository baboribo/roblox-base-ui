# 조합 구조 점검 · 0.4.0

2026-09-20에 공식 문서와 최신 기본 브랜치를 직접 읽었습니다. 앞선 0.3.1은 넘침·개별 상태를 검사했지만, 사용자 스타일과 부모 배치에 대한 계약은 충분하지 않았습니다.

## 확인한 참고 구현

- shadcn/ui `a87a63b2ca25143d26c8bd0903e4e9bc77b3f824`: [Button](https://github.com/shadcn-ui/ui/blob/a87a63b2ca25143d26c8bd0903e4e9bc77b3f824/apps/v4/registry/new-york-v4/ui/button.tsx)은 variant/size와 shrink-0, 아이콘 축소 방지를 선언합니다. [CardContent](https://github.com/shadcn-ui/ui/blob/a87a63b2ca25143d26c8bd0903e4e9bc77b3f824/apps/v4/registry/new-york-v4/ui/card.tsx)는 자식에 일괄 Grid를 강제하지 않습니다. [Field](https://github.com/shadcn-ui/ui/blob/a87a63b2ca25143d26c8bd0903e4e9bc77b3f824/apps/v4/registry/new-york-v4/ui/field.tsx)는 슬롯·방향별 배치와 container query를 사용합니다.
- 현재 shadcn Base UI 버전의 [Button](https://github.com/shadcn-ui/ui/blob/a87a63b2ca25143d26c8bd0903e4e9bc77b3f824/apps/v4/registry/bases/base/ui/button.tsx)·[Card](https://github.com/shadcn-ui/ui/blob/a87a63b2ca25143d26c8bd0903e4e9bc77b3f824/apps/v4/registry/bases/base/ui/card.tsx)·[InputGroup](https://github.com/shadcn-ui/ui/blob/a87a63b2ca25143d26c8bd0903e4e9bc77b3f824/apps/v4/registry/bases/base/ui/input-group.tsx)에서도 같은 원칙을 확인했습니다. 컨트롤의 동작과 외부 그룹·슬롯의 크기 책임을 나눕니다.
- SEED `03273ca2ccb6a7f3e883b2ac10ad4613679d5af9`: [Flex](https://github.com/daangn/seed-design/blob/03273ca2ccb6a7f3e883b2ac10ad4613679d5af9/packages/react/src/components/Flex/Flex.tsx)는 배치 속성을 Box에 전달합니다. [ActionButton recipe](https://github.com/daangn/seed-design/blob/03273ca2ccb6a7f3e883b2ac10ad4613679d5af9/packages/qvism-preset/src/recipes/action-button.ts)는 크기·상태·아이콘을 한 recipe에서 정의하고 축소를 막습니다. [createRecipeContext](https://github.com/daangn/seed-design/blob/03273ca2ccb6a7f3e883b2ac10ad4613679d5af9/packages/react/src/utils/createRecipeContext.tsx)는 variant와 나머지 props를 분리하고 ref를 보존합니다.
- [SEED Responsive Design](https://seed-design.io/react/components/concepts/responsive-design): 레이아웃 컴포넌트가 배치 규칙을 제공합니다.
- [SEED Cascade Layers](https://seed-design.io/react/getting-started/styling/cascade-layers): 기본 CSS도 unlayered라 Tailwind와 충돌할 수 있음을 명시합니다. 선택 가능한 layered 배포와 레이어 순서 설정으로 해결합니다. SEED 기본 설치가 모든 충돌을 자동 해결한다는 뜻은 아닙니다.

두 시스템 모두 임의의 모든 조합을 자동 설계하지는 않습니다. 크기·슬롯·스타일 우선순위와 배치 방법을 명시하고, 사용자가 의도한 변경이 실제 적용되도록 합니다. 외부 구현을 복사하지 않고 이 구조적 원칙을 PLY의 기존 API와 CSS에 적용했습니다.

## 원인과 수정

| 재현                                                  | 원인                                                         | 구조 변경                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| h-16·rounded-none이 무시됨                            | unlayered CSS가 Tailwind utilities보다 우선                  | 모든 스타일 진입점에서 동일 레이어 순서 선언. 토큰/theme, 공유/ply-base, 개별/ply 분리    |
| 아이콘 유무로 Input 외부 너비가 달라짐                | 사용자 크기 props는 input에, 실제 표면은 별도 wrapper에 적용 | className/style은 바깥 표면, ref·이벤트는 input. 내부 전용 inputClassName/inputStyle 제공 |
| 카드 안의 배지·버튼이 가로 전체로 늘어남              | Grid stretch에 대응하는 컴포넌트 고유 너비 없음              | 액션·배지는 fit-content, 입력은 가용 너비, 카드 열은 minmax(0,1fr)                        |
| 검색 버튼이 두 줄로 찌그러짐                          | Input 100%와 기본 flex-shrink가 경쟁                         | 버튼 축소 방지, ControlGroup에서 입력의 가용 공간과 줄 전환 관리                          |
| 비활성 상태가 과하게 흐려짐                           | 모든 rbx 하위 요소에 opacity 적용                            | 실제 조작 표면에만 적용. Field·Indicator에 중첩 적용하지 않음                             |
| Menu만 가져오면 Button을 함께 가져올 때와 크기가 다름 | 다른 컴포넌트의 CSS 로딩에 암묵적으로 의존                   | 재사용하는 Button·Field recipe를 해당 CSS에서 명시적으로 import                           |

## 검증

문서 스타일에 의존하지 않는 React+Tailwind fixture에서 문제를 재현했습니다. 색상·높이·너비·실제 선택/입력 동작과 함께, 프로젝트 설정 화면을 200/320/640px 및 밝고 어두운 테마로 비교합니다. npm tarball과 CLI 복사 소스에서도 실제 Tailwind를 빌드해 사용자 클래스가 적용되는지 확인합니다.

## 0.3.x에서 바뀌는 계약

- 장식 Input의 className/style은 전체 표면에 적용됩니다. 내부만 꾸미던 코드는 inputClassName/inputStyle로 이동합니다.
- 부모를 채우던 Button·Badge가 필요하면 w-full 또는 width:100%를 명시합니다.
- unlayered 사용자 CSS가 이제 PLY보다 우선합니다. 전역 reset은 base 레이어에 둡니다.

속성표의 MDX 빌드 캐시에도 TypeScript 소스 디렉터리를 의존성으로 등록했습니다. 타입 설명만 수정한 뒤 빌드해도 이전 설명이 남던 문제를 수정합니다. 퇴장 모션 검사는 같은 프레임의 모션·숨김 상태를 기록하여 검사의 왕복 시간과 UI 동작을 구분합니다.
