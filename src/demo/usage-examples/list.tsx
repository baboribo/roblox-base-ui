"use client";

import { Icon } from "../../components/ui/icon";
import { List } from "../../components/ui/list";
import { Badge } from "../../components/ui/badge";

export function ListExample() {
  return (
    <List.Root>
      <List.Item>
        <List.Content
          leading={<Icon name="icon-filled-smartphone-portrait" size={32} />}
          trailing={<Badge variant="contrast">Current</Badge>}
        >
          <List.Title>Mobile device</List.Title>
          <List.Description>Example session · Active now</List.Description>
        </List.Content>
      </List.Item>
      <List.Item>
        <List.Action>
          <List.Content
            leading={<Icon name="icon-filled-globe-simplified" size={32} />}
            trailing={<Icon name="icon-regular-chevron-large-right" />}
          >
            <List.Title>Browser session</List.Title>
            <List.Description>
              Example browser · Last active today
            </List.Description>
          </List.Content>
        </List.Action>
      </List.Item>
    </List.Root>
  );
}
