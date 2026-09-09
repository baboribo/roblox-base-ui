# 현재 조사 기준: Default 웹 (v0.3)

2026-09-09 로그인된 Roblox 웹에서 Browser preferences, Account info, Security, Profile, Communities, Plus, Robux FAQ, Help and safety, Account Status, private server 설정 화면을 탐색했습니다. DOM의 클래스·계산된 스타일만 측정했고 계정 값, 대화 내용, 사용자 이미지, 식별자는 결과물에 저장하지 않았습니다. Chat 그룹 Create, 설정 저장, 보안 변경, 구매는 실행하지 않았습니다.

- **현재 기준**: Default dark 실측 + 공식 배포 CSS의 Default light/dark 토큰. Classic/유료 테마 제외.
- **실측 자료**: [default-web.measurements.json](../tokens/default-web.measurements.json). 확인한 자산 URL, SHA256, 페이지, CSS 속성 목록.
- **새로 적용**: Foundation Web 버튼/입력/메뉴/다이얼로그, Chat, 체크박스·라디오, 목록·배지, Robux FAQ, Home 사이드바, 공개 glyph 38개.
- **폰트**: 실제 웹의 Builder.css가 선언한 Builder Sans 14개 font-face를 선택적으로 원격 참조합니다. 폰트 바이너리를 번들에 넣지 않았습니다.
- **혼합 스택 확인**: Marketplace 가격 필드는 `MuiOutlinedInput`이 남아 있고 Charts 필터는 legacy 버튼입니다. 이들을 최신 Foundation의 기본값으로 섞지 않았습니다.
- **Plus/회사 사이트**: 공통 Foundation 역할을 재확인하는 참고 자료. Plus 제목은 Builder Extended 40/48, 일반 Default 본문은 Builder Sans입니다.
- **Robux FAQ**: Foundation 토큰으로 만든 페이지 전용 조합입니다. 내부 Foundation Accordion export라고 추정하지 않습니다. item radius 8, padding 8/12, trigger 40, title 14/19.6 700, body 14/19.6 400, bottom 12. 배포 코드의 조건부 렌더링을 확인해 높이 애니메이션을 제외했습니다.

원본의 전체 내부 저장소를 얻은 것은 아니며, 별도 세대의 번들 안에 같은 컴포넌트 이름이 있어도 현재 화면에서 확인한 규칙을 우선했습니다. 원본 원문 FAQ·상품·계정 정보 대신 합성 예제 데이터를 사용합니다.

## Help and safety / Account Status

Help and safety의 목록은 32px 아이콘, 12px gap, 내용 시작점에 맞춘 inset divider를 씁니다. Account Status의 상태 카드에서는 padding24, gap20, surface100, radius16을 측정했습니다. 4칸 막대는 height8, gap2, 바깥 모서리4이며 카드 컬렉션은 width280, media height160, radius8, gap12입니다.

이 값은 StatusMeter/StatusCard, Carousel, List의 boxed/inset 변형으로 옮겼습니다. 숫자 상태·문구·그림은 합성 예제이며 계정 상태나 제재 내역을 저장하지 않았습니다. Carousel 탐색 버튼의 배치는 이 포트의 조합입니다.

[Help Center](https://www.roblox.com/info/help?locale=)는 [Roblox Support](https://en.help.roblox.com/hc/en-us)로 이동합니다. zdassets.com의 Zendesk CSS, 별도 theme CSS, Source Sans Pro를 확인했고 Foundation Web 요소는 없었습니다. 기본 디자인 시스템에 섞지 않았습니다.

## 출처 연결

- [FoundationCss.css](https://css.rbxcdn.com/d706fa7361f26569ce9481ec468f9f0da29aa7a0623e0da9d19a772490192ed1-FoundationCss.css): 기본636개 토큰 + Default light/dark 의미 규칙.
- [Builder.css](https://css.rbxcdn.com/835ad8483ecae12366bf4b80701ee78af7c5b58cdb95a529e061851cf7bc1c7f-Builder.css): 현재 웹 Builder Sans 선언.
- [ReactChat.css](https://css.rbxcdn.com/55329e3c435d6cd367171adae4c862957f79c6122fe72cae13e541a64890a8d6-ReactChat.css): Chat 구조 및 공개 glyph26. RobuxRedesign CSS에서 FAQ 위 화살표1개 추가.
- [About Roblox](https://about.roblox.com): 최초 회사 UI 조사. 색 계열과 서체 비교에만 사용.
- [Base UI](https://base-ui.com/react/overview/quick-start): 접근성/상태/키보드/Portal. 이 포트는 @base-ui/react 1.8.0을 사용합니다.
- [shadcn registry 규격](https://ui.shadcn.com/docs/registry/registry-item-json): 실제 소스가 포함된 registry:file 항목55개 + all 생성.

처음 조사한 내부 WebBlox 저장소는 HTTP 421로 접근하지 못했습니다. 내부 전체 컴포넌트 목록, 비공개 Figma, 모든 제품별 예외를 얻었다고 주장하지 않습니다. 이 키트는 Roblox 공식 배포 패키지가 아닙니다.

## 새 Switch

Private server의 Allow Joining/Friends Allowed 스위치는 Foundation Web Toggle입니다. medium은 40×24, padding2, thumb20. checked 트랙은 system-contrast, thumb는 inverse-content-emphasis, 체크 glyph는20입니다. unchecked 트랙은 action-standard, thumb는 content-emphasis입니다. 양옆 spacer flex-grow가300ms ease-standard-out, 색은100ms linear, 켜질 때 체크는50ms delay를 사용합니다. 공개 배포 JS에서 xs/sm/md/lg 크기표도 확인했습니다. 실제 서버 URL과 설정값은 출처 JSON에 저장하지 않았으며 원본 스위치는 전환하지 않았습니다.

## v0.3 Home 사이드바

[Roblox Home](https://www.roblox.com/home)의 최신 탐색 DOM을 2026-09-10에 읽기 전용으로 측정했습니다. Navigation.css와 Navigation.js의 공개 배포 파일로 289px 구조·1141px breakpoint·100ms 이동을 대조했습니다. 계정 이름이나 개수는 저장하지 않았습니다. Navigation에서 glyph 11개를 추가했으며, 모바일 모달 및 문서 검색은 독립 구현입니다. 출처·해시는 측정 JSON, 변경 이유는 CHANGES-v0.3.ko.md에 있습니다.
