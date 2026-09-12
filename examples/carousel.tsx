"use client";

import { Carousel } from "../src/components/ui/carousel";
import { useState } from "react";
import { Icon } from "../src/components/ui/icon";

export function CarouselExample() {
  const [selected, setSelected] = useState("");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        minWidth: 0,
      }}
    >
      <Carousel
        label="문서 목록"
        items={[
          {
            id: "tokens",
            title: "디자인 토큰",
            description: "색상과 간격을 정의합니다.",
            media: <Icon name="icon-regular-gear" size={64} />,
          },
          {
            id: "components",
            title: "컴포넌트",
            description: "사용법과 속성을 확인합니다.",
            media: <Icon name="icon-filled-two-people" size={64} />,
          },
          {
            id: "patterns",
            title: "조합 예제",
            description: "여러 컴포넌트를 연결한 예제입니다.",
            media: <Icon name="icon-filled-globe-simplified" size={64} />,
          },
        ]}
        onItemClick={setSelected}
      />
      {selected && <p role="status">선택한 예제: {selected}</p>}
    </div>
  );
}
