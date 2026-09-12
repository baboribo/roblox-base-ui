"use client";
import { useState } from "react";
import { ChatGroupPanel } from "../src/components/ui/chat";

export function ChatGroupExample() {
  const [created, setCreated] = useState("");
  return (
    <div>
      <ChatGroupPanel
        people={[
          { id: "1", name: "사용자 A" },
          { id: "2", name: "사용자 B" },
          { id: "3", name: "사용자 C" },
        ]}
        onCreate={(name, ids) =>
          setCreated(`${name || "이름 없는 그룹"}: ${ids.length}명`)
        }
      />
      <p role="status">{created}</p>
    </div>
  );
}
