"use client";
import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Button as PrimitiveButton } from "@base-ui/react/button";
import { cx } from "../../lib/cx";
import { Button } from "./button";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import "./chat.css";

export type ChatPerson = {
  id: string;
  name: string;
  presence?: string;
  avatar?: ReactNode;
};
export type ChatConversation = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  unread?: boolean;
  avatar?: ReactNode;
};
/** 표시 데이터와 이벤트만 받습니다. 네트워크/인증/실제 계정 로직은 포함하지 않습니다. */
export function ChatPanel({ className, ...props }: ComponentProps<"section">) {
  return <section {...props} className={cx("rbx-chat-panel", className)} />;
}
function AvatarPlaceholder({ name }: { name: string }) {
  return (
    <span className="rbx-chat-avatar" aria-hidden="true">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
export function ChatDock({
  conversations,
  onOpenConversation,
  onNewGroup,
  className,
}: {
  conversations: ChatConversation[];
  onOpenConversation?: (id: string) => void;
  onNewGroup?: () => void;
  className?: string;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const filtered = conversations.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <ChatPanel
      aria-labelledby={id}
      className={className}
      data-collapsed={collapsed || undefined}
    >
      <header className="rbx-chat-header">
        <h2 id={id}>Chat</h2>
        <IconButton
          icon="icon-regular-person-plus"
          size="sm"
          variant="utility"
          circular
          aria-label="New Chat Group"
          disabled={!onNewGroup}
          onClick={onNewGroup}
        />
        <IconButton
          icon="icon-regular-chevron-large-down"
          size="sm"
          variant="utility"
          circular
          aria-label={collapsed ? "Expand Chat" : "Collapse Chat"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed(!collapsed)}
        />
      </header>
      {!collapsed && (
        <>
          <div className="rbx-chat-search">
            <Input
              controlSize="sm"
              aria-label="Search conversations"
              placeholder="Search"
              value={query}
              onValueChange={setQuery}
              leading={<Icon name="icon-filled-magnifying-glass" size={16} />}
            />
          </div>
          <div className="rbx-chat-list">
            {filtered.map((item) => (
              <PrimitiveButton
                key={item.id}
                className="rbx-chat-row"
                onClick={() => onOpenConversation?.(item.id)}
                data-unread={item.unread || undefined}
              >
                {item.avatar ?? <AvatarPlaceholder name={item.title} />}
                <span className="rbx-chat-row-body">
                  <span className="rbx-chat-title-line">
                    <span className="rbx-chat-row-title">{item.title}</span>
                    <span className="rbx-chat-time">{item.updatedAt}</span>
                  </span>
                  <span className="rbx-chat-preview">{item.preview}</span>
                </span>
              </PrimitiveButton>
            ))}
            {!filtered.length && (
              <p className="rbx-chat-empty">No conversations found</p>
            )}
          </div>
        </>
      )}
    </ChatPanel>
  );
}
export function ChatGroupPanel({
  people,
  onClose,
  onCreate,
  className,
}: {
  people: ChatPerson[];
  onClose?: () => void;
  onCreate?: (name: string, memberIds: string[]) => void;
  className?: string;
}) {
  const id = useId();
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const filtered = people.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <ChatPanel aria-labelledby={id} className={cx("rbx-chat-group", className)}>
      <header className="rbx-chat-header">
        <h2 id={id}>New Chat Group</h2>
        <IconButton
          icon="icon-regular-x"
          size="sm"
          variant="utility"
          circular
          aria-label="Close group panel"
          onClick={onClose}
        />
      </header>
      <div className="rbx-chat-search">
        <Input
          controlSize="sm"
          aria-label="Name your chat group"
          placeholder="Name your chat group"
          value={name}
          onValueChange={setName}
          leading={<Icon name="icon-regular-person-plus" size={16} />}
        />
      </div>
      <div className="rbx-chat-search">
        <Input
          controlSize="sm"
          aria-label="Search for connections"
          placeholder="Search for connections"
          value={query}
          onValueChange={setQuery}
          leading={<Icon name="icon-filled-magnifying-glass" size={16} />}
          trailing={
            <span className="rbx-chat-count">({selected.length}/5)</span>
          }
        />
      </div>
      <div className="rbx-chat-list">
        {filtered.map((person) => (
          <label className="rbx-chat-person" key={person.id}>
            {person.avatar ?? <AvatarPlaceholder name={person.name} />}
            <span className="rbx-chat-row-body">
              <span className="rbx-chat-person-name">{person.name}</span>
              <span className="rbx-chat-preview">
                {person.presence ?? "Offline"}
              </span>
            </span>
            <Checkbox.Root
              size="sm"
              checked={selected.includes(person.id)}
              disabled={!selected.includes(person.id) && selected.length >= 5}
              onCheckedChange={(checked) =>
                setSelected((ids) =>
                  checked
                    ? [...ids, person.id]
                    : ids.filter((id) => id !== person.id),
                )
              }
            >
              <Checkbox.Indicator>
                <Icon name="icon-filled-check" size={20} />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </label>
        ))}
        {!filtered.length && (
          <p className="rbx-chat-empty">No connections found</p>
        )}
      </div>
      <footer className="rbx-chat-footer">
        <Button size="sm" variant="standard" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={selected.length < 2 || !onCreate}
          onClick={() => onCreate?.(name.trim(), selected)}
        >
          Create
        </Button>
      </footer>
    </ChatPanel>
  );
}
