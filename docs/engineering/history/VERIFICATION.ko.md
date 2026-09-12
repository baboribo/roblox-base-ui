# v0.4 검증 기록

검증일: 2026-09-09~10. React 19, Base UI 1.8.0, TypeScript, Chromium/Playwright. 실제 Roblox 탐색과 CSS 측정은 로그인된 앱 브라우저에서 읽기 전용으로 수행했습니다.

## 통과한 검증

- `npm run build`: TypeScript 검사, 55개 + all 레지스트리 생성, Vite 프로덕션 빌드.
- `npm test`: 5개. 복사 의존성·충돌 사전 검사·동일 파일 유지·잘못된 이름/경로 거부, 레지스트리 원본 일치, 토큰 참조 무결성, Chat/Sidebar의 TSX/CSS 재귀 의존성, Default 테마만 포함하는지 검사.
- `npm run test:ui`: 17개. 55종 전체 기본 예제 렌더링과 런타임 오류 검사, 주요 폼·선택·오버레이·탐색 상호작용.
- 실측 일치: Chat 286×360 / 그룹260×360, 헤더48, 검색32, 작은 버튼32/12, 비활성 opacity0.5, transparent Select48, 24px Radio와10px 점, Dialog480/Body20/Close36, 메뉴 padding12/16과 radius16.
- Switch: 40×24/padding2/thumb20, 켜짐·꺼짐 배경, 체크 glyph opacity, 손잡이 이동, RTL 반전, reduced-motion.
- FAQ: 질문40, item padding8/12와 radius8, 답변 bottom12, 접힘 높이58, 다중 펼침, Enter 조작, 1141px 기준 gap12/16.
- Account Status 패턴: 상태 카드 padding24/radius16, 막대8/gap2, 값 변경과 aria-valuenow, 컬렉션 카드280/media160, 이전·다음 스크롤.
- 가상 Chat: 검색, 접기/복원, 그룹 로컬 선택, 닫기/재열기 초기화, 생성 콜백 없는 Create 비활성. Create 클릭 없이 검증. 테스트 조작에서 비-GET 요청 없음.
- 접근성: Default 웹 예제 dark/light, 기존 주요 컨트롤11종, 명시적 enhanced 대비의 버튼 전체 자동 axe 검사 통과. 기본 버튼 색은 원본 alert/link의 알려진 대비 문제를 유지하므로, baseline 검사는 이 두 역할을 제외하고 검사합니다. 원본 색상 전체가 접근성 검사를 통과한다고 주장하지 않습니다.
- 반응형: 390px 폭에서 문서 수평 넘침 없음. 로컬 데스크톱/모바일 화면 확인.
- 독립 소비자: 빈 `work/consumer-v02`에 전체110개 파일 복사 후 TypeScript 검사 통과.
- 실제 shadcn CLI4.21.0: `/r/chat.json` 설치로 Chat 및 Button/Input/Checkbox/Icon/IconButton과 공통 파일16개가 생성·갱신·확인됨. 기존 동일 cx.ts는 유지. 소비자 앱의 Chat import와 TypeScript/Vite 빌드 검증.

## v0.3 사이드바 추가 검증

- 원본 치수: sidebar289, 행256×40, icon24, radius8, font16/700/22.4, 선택 shift-200. Hover 레이어와 목록의 독립 스크롤.
- 링크/버튼 구분: anchor의 href·link 역할, Enter 경로 이동, 로컬 행 선택, disabled 버튼.
- 모바일390: 열림/닫기, 역방향 Tab 포커스 잠금, Escape와 닫기/배경 클릭 후 포커스 복귀, 검색 결과/빈 결과, 선택 후 이동/닫힘과 검색 상태 유지.
- 1140↔1141 전환: 모달 제거, 검색 input 중복 없음, 다시 좁아질 때 닫힌 상태, 수평 넘침 없음.
- 열린 모바일 사이드바 dark/light 자동 axe 검사, reduced-motion 0s, RTL의 오른쪽 패널과 아이콘 순서. 양쪽 테마 스크린샷 확인.
- 실제 shadcn CLI4.21.0으로 `/r/sidebar.json`을 별도 소비자 앱에 설치. 소스14개 중 신규6개·갱신2개·동일6개. 그 앱의 Sidebar/Trigger/Link 조합을 TypeScript와 Vite 프로덕션 빌드로 검증했습니다.

전체 병렬 실행에서 빠른 breakpoint 전환 후 종료 중인 Dialog가 남는 문제를 발견했습니다. desktop으로 전환할 때 공식 `actionsRef.unmount()`를 호출해 transitionend 없이도 종료 상태를 정리하도록 수정했습니다. 수정 후 사이드바 3개 검사를 각각 5회 반복(15/15), 전체 UI 검사 15개를 다시 실행해 통과했습니다. 최종 소스도 shadcn CLI로 갱신한 소비자 앱에서 TypeScript/Vite 빌드를 통과했습니다.

## 이번 검사로 잡은 문제

1. 데모의 공통 focus CSS가 원본3px를2px로 덮어쓰던 문제를 수정했습니다.
2. FAQ 헤더에 데모 h3 여백12px가 섞여 접힘 높이가70px가 되는 문제를 수정했습니다. 결과는 원본58px입니다.
3. Input 래퍼와 input에 disabled opacity가 중복 적용되지 않게 했습니다.
4. 개별 컴포넌트 설치 시 버튼 스타일과 TSX 조합 의존성이 빠지지 않도록 수집기를 확장했습니다.
5. 원본 alert/link 색상은 기본값으로 유지하고 대비 보정은 `data-contrast="enhanced"`로 명시적으로 분리했습니다.

## 검증 범위의 한계

전체 Roblox 웹의 모든 화면·상태를 전수 픽셀 비교한 결과는 아닙니다. Light는 배포 Default 토큰 기반이며 실제 계정 테마를 바꾸지 않았습니다. 스냅샷·측정 기록에 개인 정보는 없습니다. 실제 설정 저장·보안 변경·구매·그룹 생성·메시지 전송 흐름은 실행하지 않았습니다. Switch 전환은 사용자가 허용했지만, 공개 코드로 두 상태를 확인할 수 있어 실제 서버 스위치는 건드리지 않았습니다.

원본 아바타/일러스트, 내부 Figma/비공개 API 동등성, 실제 대화방, 미측정 컴포넌트의 시각 동등성, 수동 스크린리더 감사, Firefox/Safari 전수 테스트, Next.js SSR 통합은 별도 검증 범위입니다. 데모가55종과 원본 TSX/CSS를 함께 로드해 번들 크기 알림이 있으며, 소비자에게 복사되는 파일에는 데모가 포함되지 않습니다.

## v0.4 사용 예시 검증

55개 문서의 표시 코드를 실제 실행 TSX 파일과 대조했습니다. 독립 소비자에 UI114개 파일과 예제58개를 복사해 타입 검사를 통과했습니다. 클립보드 실제 내용·추가 예제의 상태 변경·모바일 폭을 확인했고, 긴 코드 영역의 키보드 포커스와 복사 버튼의 이름을 보완한 뒤 전체 UI17개가 통과했습니다. 상세 변경은 CHANGES-v0.4.ko.md에 있습니다.
