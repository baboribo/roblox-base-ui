# 변경 기록

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
