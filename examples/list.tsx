"use client";
import { List } from "../src/components/ui/list";

export function ListExample() {
  return (
    <List.Root variant="standard">
      <List.Item>
        <List.Content>
          <List.Title>프로젝트 A</List.Title>
          <List.Description>최종 수정: 오늘</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>
          <List.Title>프로젝트 B</List.Title>
          <List.Description>최종 수정: 어제</List.Description>
        </List.Content>
      </List.Item>
    </List.Root>
  );
}
