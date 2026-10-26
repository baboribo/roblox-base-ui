"use client";
import { useState } from "react";
import { MoreHorizontal, PencilLine, Plus, Trash2 } from "lucide-react";
import { Sidebar } from "../src/components/ui/sidebar";
import { Menu } from "../src/components/ui/menu";
import { Dialog } from "../src/components/ui/dialog";
import { AlertDialog } from "../src/components/ui/alert-dialog";
import { Toast } from "../src/components/ui/toast";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Icon } from "../src/components/ui/icon";
import { Input } from "../src/components/ui/input";
import { Empty } from "../src/components/ui/empty";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { Text } from "../src/components/ui/typography";
import "./chat-history.css";

// 3단계 점검용 조합입니다. 기존 컴포넌트만 사용하고, 빠진 부분은 화면 CSS로만 채웁니다.
// 화면 CSS로 채운 곳은 docs/engineering/SCREENS-AUDIT-2.md에 문제로 기록했습니다.

type Conversation = { id: string; title: string; group: string };

const shortConversations: Conversation[] = [
  { id: "c1", title: "여름방학 여행 계획 세우기", group: "오늘" },
  { id: "c2", title: "고양이 이름 추천", group: "오늘" },
  { id: "c3", title: "자기소개서 첫 문단 다듬기", group: "지난 7일" },
  { id: "c4", title: "React 상태 관리 질문", group: "지난 7일" },
  { id: "c5", title: "주말 장보기 목록", group: "지난 7일" },
  { id: "c6", title: "하늘 프로젝트 기억 구조 정리", group: "이전" },
  { id: "c7", title: "영어 이메일 번역", group: "이전" },
];

// 긴 한국어 조건: 띄어쓰기 없는 긴 단어와 긴 문장 제목을 함께 확인합니다.
const longConversations: Conversation[] = shortConversations.map(
  (conversation, index) => ({
    ...conversation,
    title:
      index % 2 === 0
        ? `${conversation.title}와 그 다음에 이어서 물어본 여러 가지 질문을 한꺼번에 정리한 아주 긴 대화`
        : `${conversation.title.replaceAll(" ", "")}최종수정본두번째버전`,
  }),
);

const groups = ["오늘", "지난 7일", "이전"];

export type ChatHistoryState = "default" | "loading" | "empty" | "error";

function History({
  state,
  longText,
}: {
  state: ChatHistoryState;
  longText: boolean;
}) {
  const toast = Toast.useToastManager();
  const [conversations, setConversations] = useState(() =>
    state !== "default"
      ? []
      : longText
        ? longConversations
        : shortConversations,
  );
  const [selected, setSelected] = useState("c1");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState<Conversation>();
  const [deleting, setDeleting] = useState<Conversation>();
  const visible = conversations.filter((conversation) =>
    conversation.title.includes(query.trim()),
  );
  const current = conversations.find(
    (conversation) => conversation.id === selected,
  );

  function remove(target: Conversation) {
    const index = conversations.indexOf(target);
    setConversations((list) => list.filter((item) => item.id !== target.id));
    toast.add({
      title: "대화를 삭제했습니다",
      timeout: 10000,
      actionProps: {
        children: "실행 취소",
        onClick: () =>
          setConversations((list) => [
            ...list.slice(0, index),
            target,
            ...list.slice(index),
          ]),
      },
    });
  }

  let list;
  if (state === "loading") {
    list = (
      <div className="ch-skeleton" aria-busy="true">
        {[0, 1, 2, 3, 4].map((key) => (
          <Skeleton key={key} className="ch-skeleton-row" />
        ))}
      </div>
    );
  } else if (state === "error") {
    list = (
      <Alert>
        <AlertTitle>대화 기록을 불러오지 못했습니다</AlertTitle>
        <AlertDescription>잠시 뒤 다시 시도해 주세요.</AlertDescription>
        <Button size="sm" variant="standard" className="ch-retry">
          다시 시도
        </Button>
      </Alert>
    );
  } else if (conversations.length === 0) {
    list = (
      <Empty className="ch-empty">
        <h3>아직 대화가 없습니다</h3>
        <p>새 대화를 시작하면 여기에 기록이 남습니다.</p>
      </Empty>
    );
  } else if (visible.length === 0) {
    list = (
      <Empty className="ch-empty">
        <h3>‘{query}’와 일치하는 대화가 없습니다</h3>
        <p>다른 단어로 검색해 보세요.</p>
        <Button size="sm" variant="standard" onClick={() => setQuery("")}>
          검색어 지우기
        </Button>
      </Empty>
    );
  } else {
    list = (
      <nav aria-label="대화 목록">
        {groups.map((group) => {
          const items = visible.filter(
            (conversation) => conversation.group === group,
          );
          if (items.length === 0) return null;
          return (
            <Sidebar.Group key={group}>
              <Sidebar.GroupLabel>{group}</Sidebar.GroupLabel>
              <Sidebar.Menu>
                {items.map((conversation) => (
                  // Sidebar.Item에 행 옆 작업 버튼 자리가 없어 화면 CSS로 배치합니다.
                  <Sidebar.Item key={conversation.id} className="ch-item">
                    <Sidebar.Action
                      active={conversation.id === selected}
                      onClick={() => {
                        setSelected(conversation.id);
                        setOpen(false);
                      }}
                    >
                      {conversation.title}
                    </Sidebar.Action>
                    <Menu.Root>
                      <Menu.Trigger
                        render={
                          <IconButton
                            icon={<MoreHorizontal />}
                            size="sm"
                            variant="utility"
                            aria-label={`${conversation.title} 더보기`}
                          />
                        }
                        className="ch-item-menu"
                      />
                      <Menu.Portal>
                        <Menu.Positioner sideOffset={4} align="end">
                          <Menu.Popup size="sm">
                            <Menu.Item
                              onClick={() => setRenaming(conversation)}
                            >
                              <PencilLine size={16} aria-hidden="true" />
                              이름 바꾸기
                            </Menu.Item>
                            <Menu.Item
                              onClick={() => setDeleting(conversation)}
                            >
                              <Trash2 size={16} aria-hidden="true" />
                              삭제
                            </Menu.Item>
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.Root>
                  </Sidebar.Item>
                ))}
              </Sidebar.Menu>
            </Sidebar.Group>
          );
        })}
      </nav>
    );
  }

  return (
    <Sidebar.Provider open={open} onOpenChange={setOpen}>
      <div className="ch-layout">
        <Sidebar.Panel
          title="대화 기록"
          closeLabel="대화 기록 닫기"
          className="ch-sidebar"
        >
          <Sidebar.Header className="ch-sidebar-header">
            <Button
              size="md"
              variant="standard"
              className="ch-new"
              disabled={state === "loading"}
            >
              <Plus size={18} aria-hidden="true" />새 대화
            </Button>
            <Input
              type="search"
              aria-label="대화 검색"
              placeholder="대화 검색"
              controlSize="md"
              value={query}
              onValueChange={setQuery}
              leading={<Icon name="icon-filled-magnifying-glass" size={16} />}
              disabled={state !== "default" && state !== "empty"}
            />
          </Sidebar.Header>
          <Sidebar.Content>{list}</Sidebar.Content>
        </Sidebar.Panel>
        <main className="ch-main">
          <header className="ch-main-header">
            <Sidebar.Trigger
              render={
                <IconButton
                  icon="icon-regular-speech-bubble-align-center"
                  size="md"
                  variant="utility"
                  aria-label="대화 기록 열기"
                />
              }
            />
            <h1 className="ch-title">{current?.title ?? "새 대화"}</h1>
          </header>
          <Text className="ch-placeholder">
            대화 내용은 2번 대화 화면에서 점검합니다.
          </Text>
        </main>
      </div>

      <Dialog.Root
        open={Boolean(renaming)}
        onOpenChange={(next) => !next && setRenaming(undefined)}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="sm">
            <Dialog.CloseAffordance />
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                const title = String(
                  new FormData(event.currentTarget).get("title"),
                ).trim();
                setConversations((list) =>
                  list.map((item) =>
                    item.id === renaming?.id ? { ...item, title } : item,
                  ),
                );
                setRenaming(undefined);
              }}
            >
              <Dialog.Body>
                <Dialog.Title>대화 이름 바꾸기</Dialog.Title>
                <Field.Root name="title" className="ch-rename-field">
                  <Field.Label>새 이름</Field.Label>
                  <Field.Control
                    defaultValue={renaming?.title}
                    required
                    maxLength={60}
                  />
                  <Field.Error match="valueMissing">
                    이름을 입력하세요.
                  </Field.Error>
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button size="md" variant="standard" />}>
                  취소
                </Dialog.Close>
                <Button size="md" type="submit">
                  저장
                </Button>
              </Dialog.Footer>
            </Form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <AlertDialog.Root
        open={Boolean(deleting)}
        onOpenChange={(next) => !next && setDeleting(undefined)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Title>대화를 삭제할까요?</AlertDialog.Title>
            <AlertDialog.Description>
              ‘{deleting?.title}’ 대화와 이 대화에서 만든 기억이 함께
              삭제됩니다.
            </AlertDialog.Description>
            {/* AlertDialog에 작업 영역 파트가 없어 화면 CSS로 배치합니다. */}
            <div className="ch-alert-actions">
              <AlertDialog.Close render={<Button variant="standard" />}>
                취소
              </AlertDialog.Close>
              <AlertDialog.Close
                render={<Button variant="alert" />}
                onClick={() => deleting && remove(deleting)}
              >
                삭제
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Sidebar.Provider>
  );
}

export function ChatHistoryExample({
  state = "default",
  longText = false,
}: {
  /** 화면의 데이터 상태입니다. @defaultValue "default" */
  state?: ChatHistoryState;
  /** 긴 한국어 제목으로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
}) {
  return (
    <Toast.Provider>
      <History key={`${state}-${longText}`} state={state} longText={longText} />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
