"use client";

import { Accordion } from "../src/components/ui/accordion";

export function AccordionExample() {
  return (
    <Accordion.Root defaultValue={["tokens"]}>
      {[
        [
          "tokens",
          "토큰은 어디서 바꾸나요?",
          "src/styles/theme.css에서 --rbx-color-system-emphasis를 재정의하면 강조색이 바뀝니다.",
        ],
        [
          "source",
          "소스를 직접 수정할 수 있나요?",
          "컴포넌트별 TSX와 CSS 파일을 복사해 프로젝트에서 직접 관리합니다.",
        ],
        [
          "base",
          "Base UI는 어떤 역할인가요?",
          "키보드 조작, 상태, 포커스 관리와 접근성 속성을 처리합니다.",
        ],
      ].map(([value, title, body]) => (
        <Accordion.Item key={value} value={value}>
          <Accordion.Header>
            <Accordion.Trigger>
              {title}
              <Accordion.Chevron />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <div>{body}</div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
