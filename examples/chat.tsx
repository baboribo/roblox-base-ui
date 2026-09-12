"use client";

import { useState } from "react";
import {
  ChatDock,
  ChatGroupPanel,
  type ChatConversation,
  type ChatPerson,
} from "../src/components/ui/chat";

export const people: ChatPerson[] = [
  { id: "demo-1", name: "Studio Crew", presence: "Online" },
  { id: "demo-2", name: "Pixel Builder", presence: "In Studio" },
  { id: "demo-3", name: "Cloud Explorer", presence: "Offline" },
  { id: "demo-4", name: "Orbit Maker", presence: "Online" },
  { id: "demo-5", name: "Weekend Club", presence: "Offline" },
  { id: "demo-6", name: "Nova", presence: "Offline" },
];

export const conversations: ChatConversation[] = people.map(
  (person, index) => ({
    id: person.id,
    title: person.name,
    preview: [
      "파일을 공유했습니다.",
      "변경사항을 확인했습니다.",
      "일정을 확인했습니다.",
    ][index % 3],
    updatedAt: ["Now", "2h", "Yesterday"][index % 3],
    unread: index === 0,
  }),
);

export function ChatExample() {
  const [group, setGroup] = useState(false);
  const [opened, setOpened] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: 16,
        }}
      >
        <ChatDock
          conversations={conversations}
          onNewGroup={() => setGroup(true)}
          onOpenConversation={(id) =>
            setOpened(conversations.find((item) => item.id === id)!.title)
          }
        />
        {group && (
          <ChatGroupPanel people={people} onClose={() => setGroup(false)} />
        )}
      </div>
      {opened && <p role="status">{opened} — 선택한 대화</p>}
    </div>
  );
}
