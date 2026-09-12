"use client";
import { useState } from "react";
import { List } from "../src/components/ui/list";

export function ListActionExample() {
  const [opened, setOpened] = useState(false);
  return (
    <div>
      <List.Root>
        <List.Item>
          <List.Action onClick={() => setOpened(true)}>
            <List.Content>
              <List.Title>프로젝트 A</List.Title>
              <List.Description>선택해서 열기</List.Description>
            </List.Content>
          </List.Action>
        </List.Item>
      </List.Root>
      <p role="status">{opened ? "프로젝트 A를 선택했습니다." : ""}</p>
    </div>
  );
}
