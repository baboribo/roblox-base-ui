# v0.3 — 같은 사이드바를 문서 앱과 내 앱에서 재사용하기

Roblox Home의 Default 사이드바를 읽기 전용으로 측정하고, **BLOCK/UI의 실제 탐색을 이 컴포넌트로 교체**했습니다. 원본 항목 이름과 계정 데이터를 BLOCK/UI에 복사하는 대신, 측정한 시각 규칙을 라이브러리 탐색에 적용했습니다.

## 먼저 볼 diff

| 위치                      | 이전                                 | 현재                                                               |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------ |
| `src/demo/App.tsx`        | 헤더 페이지 링크 + 전용 aside/button | `Sidebar.Provider/Panel` 안에 페이지 링크와 컴포넌트 목록을 조합   |
| `src/demo/app.css`        | 260px 사이드바, 작은 화면 가로 목록  | 289px 사이드바, 1141px 미만에서 메뉴 버튼과 모바일 패널            |
| `navigation-item.tsx/css` | 없음                                 | 40px 탐색 행, 24px Icon, 선택/hover/press, 링크와 버튼             |
| `sidebar.tsx/css`         | 없음                                 | Header/Content/Footer/Group/Menu/Item, Base UI ScrollArea와 Dialog |
| `icon.tsx/css`            | glyph 27개                           | Navigation 배포 CSS의 11개를 추가해 38개                           |
| 레지스트리                | 53종                                 | 55종 + all, sidebar 의존 파일을 재귀 수집                          |

기존 `.sidebar`, `.nav-group`, `.search-wrap` 전용 스타일은 제거했습니다. 새 사이드바의 선택 배경은 파란 action 토큰 대신 원본 `shift-200`입니다.

## 작은 것에서 큰 것으로 읽기

```text
Icon                         원본 glyph를 그리는 CSS mask
  └─ NavigationContent       아이콘 칸 / 레이블 / trailing 칸
      ├─ NavigationItem      Base UI Button: 화면 안에서 선택/작업
      └─ NavigationLink      Base UI useRender: 페이지 이동용 <a>
          └─ Sidebar         목록·그룹·스크롤·모바일 패널
              └─ App         실제 경로, 검색어, 선택한 컴포넌트
```

`NavigationContent`는 링크와 버튼의 시각 구조를 공유하는 내부 함수입니다. `NavigationLink`를 별도로 둔 이유는 anchor를 Base UI Button으로 감쌀 때 따라오는 button 역할과 Space 활성화를 피하고, 링크의 Enter·새 탭 열기·주소 복사 동작을 보존하기 위해서입니다. `render={<Link href="…" />}`로 라우터 링크를 연결할 수 있습니다. 라우터 요소는 props/ref를 실제 anchor에 전달해야 합니다.

`Sidebar.Action`은 `NavigationItem`, `Sidebar.Link`는 `NavigationLink`의 같은 함수 참조입니다. 사이드바 안에서만 쓸 수 있는 별도 행을 만들지 않았습니다. `leading`에는 Avatar 등, `trailing`에는 Badge 등을 넣을 수 있습니다. 두 칸 안에는 중첩 버튼이나 링크를 넣지 마세요.

## 원본에서 확인한 값

Home DOM/computed style와 Navigation.css/Navigation.js를 함께 확인했습니다. 출처 URL·SHA256은 `tokens/default-web.measurements.json`에 있습니다.

| 속성                | 값                                                    |
| ------------------- | ----------------------------------------------------- |
| 전체 폭             | 289px: 내용 288px + 구분선 1px                        |
| 내용 여백 / 항목 폭 | 세로12px, 가로16px / 256px                            |
| 행 / 간격           | 높이40px / 8px                                        |
| 행 안쪽 여백        | 시작4px, 끝2px                                        |
| 아이콘 칸 / glyph   | 40px / 24px                                           |
| 레이블              | Builder Sans 700, 16px / 22.4px                       |
| 모서리 / 선택 배경  | 8px / shift-200                                       |
| hover·press         | 선택 배경 위에 state-hover/state-press 레이어         |
| 넓은 화면 기준      | 1141px 이상 항상 표시                                 |
| 이동                | 100ms, cubic-bezier(.2, 0, 0, 1), reduced-motion 제외 |

## BLOCK/UI에서 추가한 부분

검색을 상단에 고정하고 페이지 링크·컴포넌트 그룹·푸터를 조합했습니다. 아이콘 없는 카탈로그 행과 작은 그룹 제목은 문서 탐색에 맞춘 확장입니다. 원본 header는 폭에 따라 40px/74px이고 BLOCK/UI는 기존 80px를 유지합니다. 위치와 높이는 라이브러리에 고정하지 않고 호스트의 `.library-sidebar`가 맡습니다.

모바일에서는 Base UI Dialog의 모달, 포커스 잠금/복귀, Escape, 배경 클릭, 닫기 버튼을 사용합니다. 원본 코드의 visibility/translate 방식에서 확장한 부분이며, 원본 모바일 동작을 전부 그대로 옮겼다는 뜻은 아닙니다. 화면 폭이 커지면 열림 상태를 초기화하고, `actionsRef.unmount()`로 Base UI의 종료 상태도 정리합니다. Panel의 DOM이 먼저 교체되면 transitionend가 발생하지 않아 종료 중인 모달이 다시 나타날 수 있기 때문입니다.

`Panel`은 데스크톱/모바일 중 하나만 렌더합니다. 두 개의 검색 input과 중복 id를 CSS로 숨기지 않습니다. 화면 크기 전환에서 유지할 값은 App처럼 상위 상태에 두세요. viewport 구독은 SSR snapshot을 제공하지만 Next.js 통합 실행은 별도 검증 범위입니다.

## 내 프로젝트에서 조합하기

키트 폴더에서 실행:

```sh
npm run ui -- add sidebar --cwd /absolute/path/to/my-app
```

또는 로컬 키트 서버가 켜져 있을 때, shadcn 설정이 있는 대상 앱에서:

```sh
npx shadcn@latest add http://127.0.0.1:5173/r/sidebar.json
```

Sidebar의 TSX/CSS와 NavigationItem, Icon, IconButton, ScrollArea, 공통 스타일/유틸리티가 함께 들어갑니다. 데모의 Button/Badge/Input까지 쓰면 해당 항목도 추가하세요.

아래는 Sidebar만 설치한 앱에서 쓸 수 있는 최소 조합입니다. 앱 진입점에서 `styles/theme.css`를 import하고 html에 `data-theme`를 설정하세요.

```tsx
"use client";
import { useState } from "react";
import { Sidebar } from "./components/ui/sidebar";

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <Sidebar.Provider open={open} onOpenChange={setOpen}>
      <Sidebar.Trigger>메뉴 열기</Sidebar.Trigger>
      <Sidebar.Panel
        title="사이트 탐색"
        closeLabel="탐색 닫기"
        style={{ height: "100dvh" }}
      >
        <Sidebar.Content>
          <nav aria-label="주요 탐색">
            <Sidebar.Menu>
              <Sidebar.Item>
                <Sidebar.Link
                  href="/"
                  icon="icon-regular-house"
                  active
                  onClick={() => setOpen(false)}
                >
                  홈
                </Sidebar.Link>
              </Sidebar.Item>
              <Sidebar.Item>
                <Sidebar.Link
                  href="/library"
                  icon="icon-regular-backpack"
                  onClick={() => setOpen(false)}
                >
                  라이브러리
                </Sidebar.Link>
              </Sidebar.Item>
            </Sidebar.Menu>
          </nav>
        </Sidebar.Content>
      </Sidebar.Panel>
    </Sidebar.Provider>
  );
}
```

실제 앱에서는 `active`를 현재 경로로 계산합니다. 항상 표시하는 패널만 필요하면 `Provider/Panel/Trigger` 대신 `Sidebar.Root`를 사용하세요. 폭은 `--rbx-sidebar-width`로 바꾸고, breakpoint를 바꾸려면 sidebar.tsx의 media query와 sidebar.css의 같은 값을 함께 수정합니다.

일반 shadcn 컴포넌트와 나란히 설치할 수 있으며 이 컴포넌트의 동작 기반은 `@base-ui/react`입니다. 기존 shadcn Sidebar API와 동일한 대체품은 아닙니다. 자세한 검증 결과는 [VERIFICATION.ko.md](VERIFICATION.ko.md)에 있습니다.
