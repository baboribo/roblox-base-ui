# SEED 비교와 적용

확인일: 2026-09-12. SEED의 `dev` 브랜치를 다시 fetch했으며, 확인한 커밋은 `d22924148878924d010bbee5232a87d9c7b05664`입니다.

## 비교 결과

| 항목 | SEED에서 확인한 방식 | 이 프로젝트에 적용한 내용 |
| --- | --- | --- |
| API 문서 | TypeScript에서 속성표를 생성하고 외부 선언을 걸러냅니다. | Button, Input, IconButton, Switch.Root의 추가 속성을 타입에서 생성합니다. 필수 여부·설명·기본값도 표시합니다. |
| 상태 비교 | VariantTable로 여러 속성의 조합을 렌더합니다. | 타입이 유지되는 행·열 조합표를 만들었습니다. Button 72개, Input 36개 상태를 실제 컴포넌트로 비교합니다. |
| 예제 오류 | ErrorBoundary가 예제 렌더 오류를 처리합니다. | iframe 안에서 오류를 처리하고 재로딩 버튼을 제공합니다. 정상 예제에도 초기화 버튼을 붙였습니다. |
| 검색 | 문서 검색과 컴포넌트·토큰 검색을 구분하고 인덱스를 필요할 때 읽습니다. | 현재 규모에서는 기존 검색을 유지합니다. 이미 지연 로딩·초성 검색·별칭 우선순위·오류 재시도를 제공합니다. |
| 코드 계층 | 동작, 스타일, 복사용 snippet을 분리합니다. | 현재 Base UI 동작 + 로컬 CSS + 복사 CLI 구성을 유지합니다. 이번 변경에 새로운 UI 엔진은 필요하지 않습니다. |

SEED의 전체 구조가 항상 더 적합한 것은 아닙니다. 여러 플랫폼과 패키지를 배포하는 SEED의 모노레포·토큰 생성 도구·Figma 연동은 현재 프로젝트의 요구보다 큽니다. 문서 유지보수와 상태 확인에 직접 도움이 되는 부분을 우선 적용했습니다.

## 핵심 변경

### 속성표

`source.config.ts`의 `remarkAutoTypeTable`이 MDX를 빌드할 때 타입을 읽습니다. `docs/lib/api-generator.ts`는 이 프로젝트의 선언만 남기고 React/HTML에서 상속한 공통 속성을 제외합니다. 공통 속성은 각 페이지에서 Base UI 공식 문서로 연결합니다.

컴포넌트 파일의 JSDoc이 설명과 기본값을 소유합니다. 기본값은 실행 코드의 기본 매개변수와 함께 변경해야 합니다. 존재하지 않는 타입을 지정하면 빌드를 실패시킵니다. 4개 타입을 처리하는 현재 규모에서는 매번 원본을 읽어 외부 의존 타입이 바뀐 뒤 캐시가 남는 문제를 피합니다.

SEED에 있던 ts-morph 방식의 필터를 그대로 가져오지 않았습니다. 설치된 fumadocs-typescript 5.4와 TypeScript 7의 선언 경로 API에 맞춰 구현했습니다.

### Storybook

`stories/components/variant-matrix.tsx`가 행과 열의 조합을 렌더합니다. Button/Input의 Controls와 조합표가 같은 선택지 배열을 사용합니다. 네 가지 크기와 기본·비활성·오류 상태를 비교할 수 있습니다. 전체 Storybook 사례는 65개입니다.

### 예제 복구

`docs/components/example-boundary.tsx`가 렌더링과 지연 로딩 오류를 잡습니다. 재시도는 iframe 문서를 다시 로드합니다. React.lazy에 저장된 실패 결과까지 지워야 하므로 ErrorBoundary 상태만 초기화하지 않습니다. 일반 초기화도 iframe을 새로 생성해 입력과 로컬 상태를 비웁니다.

네트워크 응답 전체가 끊겨 iframe 문서 자체를 받지 못한 경우와 이벤트 핸들러의 비동기 오류는 이 React 경계의 처리 범위가 아닙니다.

## 검증

- 원본 타입의 union, 필수 속성, 기본값 및 외부 속성 제외를 검사합니다.
- 모바일에서 속성표를 펼치고, 예제를 초기화해 상태가 돌아오는지 확인합니다.
- 실제 iframe의 입력 요소 렌더링에 오류를 주입하고 문서 유지·코드 열기·재로딩 후 입력을 검증합니다.
- Storybook 전체 사례와 조합표의 개수·크기·비활성·오류 속성·실제 입력을 검사합니다.
- 복사할 TSX의 주석이 변경되어 레지스트리 JSON도 다시 생성했습니다.

## 확인한 SEED 원본

- [속성표 생성기](https://github.com/daangn/seed-design/blob/d22924148878924d010bbee5232a87d9c7b05664/docs/components/type-table/generator.ts)
- [Action Button 문서](https://github.com/daangn/seed-design/blob/d22924148878924d010bbee5232a87d9c7b05664/docs/content/react/components/action-button.mdx)
- [VariantTable](https://github.com/daangn/seed-design/blob/d22924148878924d010bbee5232a87d9c7b05664/docs/stories/components/variant-table.tsx)
- [예제와 오류 경계](https://github.com/daangn/seed-design/blob/d22924148878924d010bbee5232a87d9c7b05664/docs/components/component-example.tsx)
- [검색 인덱스 지연 로딩](https://github.com/daangn/seed-design/blob/d22924148878924d010bbee5232a87d9c7b05664/docs/components/search/use-search-index.ts)
