# 다이얼로그 배경이 생략되던 문제

작업 경로: `/Users/ema/Documents/devs/roblox-base-ui`.

## 원인

`Dialog.Backdrop`과 배경 CSS는 이미 있었습니다. 그러나 `Sidebar.Provider` 내부의 Base UI `Dialog.Root`가 앱 전체를 감싸면서, 페이지의 Dialog와 AlertDialog도 중첩 모달로 인식됐습니다. Base UI는 중첩 Dialog의 Backdrop을 기본적으로 렌더하지 않습니다. 그래서 클릭 차단은 작동하더라도 어두운 시각적 배경이 보이지 않았습니다.

## 변경

- Provider는 사이드바의 상태와 handle만 공유합니다.
- Dialog.Root를 Sidebar.Panel 내부로 이동해 모달 범위를 좁혔습니다.
- Panel 바깥의 Sidebar.Trigger는 같은 `Dialog.createHandle()`로 연결합니다.
- 기존 모바일 전환 시 종료 상태 정리와 외부 API는 유지합니다.
- Backdrop의 강제 렌더 옵션이나 더 높은 z-index로 증상을 덮지 않았습니다.

기존 공통 배경 토큰을 사용합니다. Dark는 `rgba(10,10,14,.75)`, Light는 `rgba(10,10,14,.5)`이며, 전체 화면을 덮고 팝업은 그 위에 놓입니다. `<Dialog.Portal>` 안에 `<Dialog.Backdrop />`와 `<Dialog.Popup>`을 함께 두는 사용 예시도 그대로입니다.

## 검증

빌드와 단위 검사5개 통과. 기존 UI17개와 새 Backdrop 검사2개 통과. 1440px/390px, dark/light에서 배경 DOM·색·불투명도·전체 화면 범위·팝업과의 레이어 순서를 확인하고, Escape/배경 클릭 후 닫힘과 포커스 복귀를 검사했습니다. 일반 Dialog와 AlertDialog도 별도 확인했습니다.

첫 전체 실행에서 새 검사의 화면 크기 반복이 이전 light 테마 상태를 유지하는 테스트 설정 문제를 발견했습니다. 반복마다 페이지를 새로 로드하도록 수정한 뒤 새 검사2개를 재실행했습니다.

5173 미리보기 서버도 이전 Codex 출력 폴더에서 새 작업 경로로 전환했습니다. 공개 레지스트리의 sidebar/all 항목도 재생성했습니다.
