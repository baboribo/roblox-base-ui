# PLY npm 배포

## 파일 역할

- `src/components/ui`: 문서, 복사 CLI, npm 패키지가 함께 사용하는 원본입니다.
- `src/index.ts`: 전체 패키지에서 공개하는 컴포넌트와 타입입니다.
- `packaging/ui/package.json`: npm 이름, 버전, 의존성, 라이선스입니다. 루트 package.json은 문서 개발용이며 계속 private입니다.
- `scripts/build-package.mjs`: JavaScript·타입 선언·CSS를 `dist/npm`으로 만듭니다. 각 파일의 `use client`를 유지하며 상대 import에 `.js`를 붙입니다.
- `scripts/test-package.mjs`: 실제 `.tgz`를 저장소 밖의 새 프로젝트에 설치하고 TypeScript, Vite, Next.js 빌드와 브라우저 조작을 검사합니다. 패키지 import와 CLI 소스 복사를 각각 확인합니다.
- `dist/ply-ui-버전.tgz`: npm에 올리는 압축파일입니다. dist는 Git에서 제외됩니다.

`cli/`에는 설치 명령을, `templates/src/`에는 해당 버전의 원본을 포함합니다. npm의 bin은 `ply-ui`이며 `pnpm dlx ply-ui add`로 실행합니다. 저장소의 복사 도구와 같은 경로·충돌 검사를 사용합니다.

## 준비와 검증

버전은 `packaging/ui/package.json`에서 수정합니다. 이미 공개한 버전은 다시 사용할 수 없습니다.

```sh
pnpm package:build
pnpm package:pack
# 위 두 명령을 포함하여 설치와 호환성까지 확인합니다.
pnpm package:test
```

패키지는 React 19와 React DOM 19를 peer dependency로 요구합니다. Base UI는 일반 dependency입니다. 문서 사이트용 Next.js, Fumadocs, Storybook은 패키지 의존성이나 압축파일에 포함하지 않습니다.

토큰·모션은 공통 스타일에서, 개별 CSS는 해당 컴포넌트 import에서 로드됩니다. fonts.css만 선택 사항으로 분리합니다. CSS 파일은 tree shaking으로 삭제되지 않도록 sideEffects에 표시합니다.

## 공개

처음에는 npm 계정에 로그인하고, 브라우저에서 이 컴퓨터의 접근을 인증합니다. 웹사이트의 Account → Two-Factor Authentication에서 2FA도 설정합니다. 일반 로그인만으로 공개를 시도하면 npm이 403 오류로 거절합니다. 인증 정보는 소스 저장소에 저장하지 않습니다.

```sh
npm login --auth-type=web
npm whoami
```

빌드·설치·압축에는 pnpm을, 브라우저 인증과 공개에는 npm CLI를 사용합니다. 검증한 압축파일을 그대로 배포합니다. 아래 버전은 실제 manifest의 버전으로 바꿉니다.

```sh
npm publish ./dist/ply-ui-0.3.0.tgz --access public
npm view ply-ui version
```

상대 경로는 반드시 `./dist/`로 시작합니다. npm의 성공 응답 뒤에도 레지스트리 반영에 시간이 걸릴 수 있습니다. 버전과 latest 태그를 조회하고 공개 tarball의 해시가 검증한 파일과 일치하는지 확인합니다. Git 커밋·푸시와 GitHub 릴리즈는 별도로 진행합니다.

라이선스는 PLY 원본 코드에 MIT를 적용합니다. 제3자 자료의 범위는 패키지에 포함되는 `THIRD_PARTY_NOTICES.md`에 기록합니다.
