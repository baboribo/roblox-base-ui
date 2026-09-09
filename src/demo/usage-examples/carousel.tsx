"use client";

import { Carousel } from "../../components/ui/carousel";
import { useState } from "react";
import { Icon } from "../../components/ui/icon";

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
        label="Learning resources"
        items={[
          {
            id: "tokens",
            title: "Design tokens",
            description: "Start with colors and spacing.",
            media: <Icon name="icon-regular-gear" size={64} />,
          },
          {
            id: "components",
            title: "Components",
            description: "Combine accessible primitives.",
            media: <Icon name="icon-filled-two-people" size={64} />,
          },
          {
            id: "patterns",
            title: "Patterns",
            description: "Create your own interface.",
            media: <Icon name="icon-filled-globe-simplified" size={64} />,
          },
        ]}
        onItemClick={setSelected}
      />
      {selected && <p role="status">선택한 예제: {selected}</p>}
    </div>
  );
}
