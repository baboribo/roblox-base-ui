# 변경 기록

## 미출시

- 글꼴 토큰에 시스템 산세리프와 한글 글꼴(Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR) 대체 목록을 둡니다. Builder Sans를 받지 못해도 숫자·영문이 명조로 바뀌지 않습니다. `--rbx-font-body`를 바꾸면 typography 토큰도 따라 바뀝니다.
- 한국어가 어절 중간에서 끊기지 않도록 `word-break: keep-all`을 기본으로 둡니다(`:root`와 컴포넌트, 우선순위 0). 공간이 모자란 긴 단어만 끊습니다.
- Alert에 `tone`(neutral·success·warning·error)을 추가합니다. 기본 `role`은 error일 때 alert, 나머지는 status입니다. `AlertTitle`은 `as`로 제목 수준을 고르고, Card 클래스 대신 전용 클래스를 씁니다.
- **기본 색 변경:** `Button variant="alert"` 글자, 오류 문구(`Field.Error` 등), 다크 테마 `variant="link"` 글자를 WCAG AA 대비(4.5:1)를 넘게 보정합니다. 이전에 `data-contrast="enhanced"`로만 켜던 보정이 기본값이 되었고, 이 속성은 더 이상 필요하지 않습니다. 새 토큰 `--rbx-color-content-alert`를 오류 글자에 씁니다.
- Carousel 항목에 `href`를 지정하면 링크가 됩니다. `label` 대신 `aria-labelledby`로 화면의 제목을 연결할 수 있습니다. 항목이 버튼·링크이면 스크롤 영역이 이름 없는 Tab 정지점이 되지 않습니다.
- Button의 `render`에 `href`가 있는 요소를 넘기면 `role="button"`과 Space 실행을 붙이지 않고 링크로 둡니다. `nativeButton={false}`는 지정하지 않아도 됩니다.
- Dialog·Alert Dialog 문서에 첫 포커스(`initialFocus`)와 삭제 뒤 복귀 포커스(`finalFocus`) 안내와 예제를 추가합니다.
- Carousel의 보조기기 영역 설명을 "캐러셀"로 바꾸고 `roleDescription`으로 변경할 수 있게 합니다. NumberField 증감 버튼과 입력의 Base UI 영어 기본 이름을 "늘리기"·"줄이기"·"숫자 입력"으로 바꿉니다. 지정한 속성은 그대로 우선합니다.
- Combobox `modal`에서 Base UI가 추가하는 숨은 닫기 버튼 이름("Dismiss")을 바꿀 수 없다는 제한을 문서에 기록합니다.
- 디자인 원칙에 대상 사용자·범위·배포 방식·대표 화면과 시맨틱 HTML, 한국어 기본 문구 원칙을 추가합니다.
- 닫힌 팝업 계열 Portal이 마운트·리사이즈마다 전체 테마 토큰(약 1,100개)을 읽고 모든 상위 요소를 관찰하던 문제를 수정합니다. 이제 실제로 열린 동안에만 토큰을 동기화합니다. 열린 중의 테마 변경 반영은 유지합니다.
- Carousel의 이전·다음 버튼이 끝에 도달해 비활성화될 때 키보드 포커스가 body로 사라지던 문제를 수정합니다. 버튼은 포커스를 유지하고 aria-disabled로 상태를 전달합니다.

## 0.4.0

- 기본·컴포넌트·사용자 스타일의 CSS 레이어를 분리합니다. Tailwind 클래스와 일반 사용자 CSS가 의도한 크기·간격을 적용합니다.
- Button·Badge의 고유 너비와 버튼 축소 방지를 명시하고, Input·Select의 필드 레이블을 정렬합니다.
- 장식 Input의 className/style은 전체 표면에 적용합니다. 내부 전용 inputClassName/inputStyle을 추가하며 ref·이벤트·Field 상태는 실제 입력에 유지합니다.
- Field·Indicator에 중첩 적용되던 disabled 투명도를 실제 조작 표면으로 제한합니다.
- 공유 CSS recipe를 명시적으로 import하여 다른 컴포넌트의 로딩 여부로 디자인이 바뀌는 문제를 제거합니다.
- Stack·Inline·Grid·ControlGroup을 추가하고, 반응형 예제를 실제 프로젝트 설정 조합으로 교체합니다.
- 실제 Tailwind 소비자와 설치 패키지에서 스타일 우선순위·폭·줄 전환·테마·입력 및 저장을 검증합니다.

### 마이그레이션

장식 Input 내부만 꾸미던 className/style은 inputClassName/inputStyle로 이동합니다. 부모를 채우는 Button·Badge에는 w-full 또는 width:100%를 지정합니다. 전역 reset은 @layer base에 둡니다.

## 0.3.1

- 퇴장 중인 Toast가 키보드와 접근성 탐색에 남아 이전 작업을 다시 실행할 수 있던 문제를 수정합니다.
- 기본 CSS를 나중에 로드했을 때 Button 크기와 Textarea 높이가 바뀌던 우선순위 문제를 수정합니다.
- Button 로딩 중 폭 변화·키보드 포커스 유실을 수정하고, render로 합성한 링크의 이름과 ref를 유지합니다.
- Pagination의 페이지 수 감소 시 내부 상태와 콜백을 보정합니다. 좁은 부모 영역에서는 직접 페이지 입력으로 전환하고 리사이즈 후에도 포커스를 유지합니다.
- 여러 Trigger가 공유하는 Tooltip의 설명을 실제 활성 Trigger에만 연결합니다. 외부 handle Trigger도 설명을 자동으로 연결합니다.
- Portal에 직접 지정한 테마를 우선하고 선언 위치의 글자 방향을 전달합니다.
- Table이 기본 가로 스크롤 영역을 제공하며 실제 table의 의미와 ref는 유지합니다.
- Tabs·Toolbar·Menubar의 가로 넘침, 세로 방향 Tabs 표시 막대, 제어된 탭 선택 후 스크롤을 수정합니다.
- 긴 Button·Badge·메뉴·대화상자·목록 텍스트를 줄바꿈하고 OTP 입력 폭을 부모 영역에 맞춥니다.
- ScrollArea의 가로 스크롤바 치수와 Combobox 칩 삭제 버튼 크기를 수정합니다.
- 좁은 영역에서 Carousel 카드 너비와 한 번에 이동하는 거리를 함께 줄입니다.
- List·NavigationItem의 숫자 0이 내용 슬롯 밖에 출력되던 문제를 수정합니다.
- 문서 스타일이 없는 독립 React 환경에서 좁은 부모·긴 이름·상태 변경·키보드 조작을 재현하는 회귀 검사를 추가했습니다.

## 0.3.0

### 추가

- Spinner: 크기 3종, 읽기 이름, 모션 줄이기 지원.
- Pagination: 제어/비제어 페이지 선택, 처음·끝 이동 제한, 긴 목록 생략, 비활성 상태.
- Button과 IconButton의 loading: 처리 중 표시, 중복 실행 방지, aria-busy.
- Textarea의 controlSize, variant 및 크기·오류 예제.

### 수정

- 팝업 계열의 Portal에 선언 위치의 테마와 의미 토큰을 전달합니다. 기존 ref/render API를 유지합니다.
- Tooltip의 설명을 Trigger와 연결하고 Popup의 역할을 지정합니다. 기존 설명 ID와 사용자 Popup ID를 유지합니다.
- Tooltip 화살표의 색상을 본문 배경과 일치시킵니다.
- Textarea의 고정 높이를 제거해 rows가 반영되게 합니다. 기본 최소 높이 100px은 유지합니다.
- Input의 숫자 0 장식을 보존하고, 문자열 aria-invalid도 입력 그룹에 반영합니다.
- 오류 테두리를 Textarea 등 네이티브 입력에도 적용합니다.
- Dialog 닫기 버튼·제목 여백에 논리 방향을 사용하고, Drawer가 공통 모달 레이어 토큰을 따릅니다.
- 오래된 Select 측정 검사와 설치 명령 검사를 현재 공개 API에 맞췄습니다.

### 사용 시 참고

- 기존 공개 API를 제거하지 않았습니다. 포털의 DOM 접근성 속성이 추가됩니다.
- Root 밖의 handle Tooltip.Trigger는 Popup의 설명 ID를 직접 연결합니다.
- Pagination의 데이터 요청과 URL 변경은 onPageChange에서 앱에 연결합니다.
- 소스를 복사한 프로젝트는 npm 업데이트만으로 바뀌지 않습니다. 공통 Portal helper와 컴포넌트 변경을 함께 반영합니다.

## 0.2.2

- 화면 가장자리에서 Select 목록만 밀려 버튼이 이중으로 보이던 문제를 수정했습니다.

## 0.2.1

- Select의 영역별 테마, 그림자, 사용자 색상 토큰, 오류 테두리 전달을 수정했습니다.
