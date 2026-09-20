# 변경 기록

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
