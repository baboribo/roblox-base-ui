"use client";

import { Carousel } from "../src/components/ui/carousel";
import { Heading } from "../src/components/ui/typography";
import { Icon } from "../src/components/ui/icon";

export function CarouselLinksExample() {
  return (
    // 제목을 Carousel에 연결하고 바깥을 다시 section으로 감싸지 않아, 같은 이름의 영역이 겹치지 않습니다.
    <div style={{ display: "grid", gap: 12, width: "100%", minWidth: 0 }}>
      <Heading id="carousel-links-title">문서 바로가기</Heading>
      <Carousel
        aria-labelledby="carousel-links-title"
        items={[
          {
            id: "tokens",
            title: "디자인 토큰",
            description: "색상과 간격을 정의합니다.",
            media: <Icon name="icon-regular-gear" size={64} />,
            href: "/docs/foundations",
          },
          {
            id: "components",
            title: "컴포넌트",
            description: "사용법과 속성을 확인합니다.",
            media: <Icon name="icon-filled-two-people" size={64} />,
            href: "/docs/components/button",
          },
          {
            id: "patterns",
            title: "조합 예제",
            description: "여러 컴포넌트를 연결한 예제입니다.",
            media: <Icon name="icon-filled-globe-simplified" size={64} />,
            href: "/docs/patterns",
          },
        ]}
      />
    </div>
  );
}
