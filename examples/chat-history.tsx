"use client";
import { useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  FileText,
  Folder,
  Image as ImageIcon,
  Library,
  Mic,
  MoreHorizontal,
  PanelLeft,
  PencilLine,
  Pin,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Sidebar } from "../src/components/ui/sidebar";
import { Menu } from "../src/components/ui/menu";
import { Dialog } from "../src/components/ui/dialog";
import { AlertDialog } from "../src/components/ui/alert-dialog";
import { Toast } from "../src/components/ui/toast";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Avatar } from "../src/components/ui/avatar";
import { Badge } from "../src/components/ui/badge";
import { Input } from "../src/components/ui/input";
import { Textarea } from "../src/components/ui/textarea";
import { Skeleton } from "../src/components/ui/skeleton";
import { Inline, Stack } from "../src/components/ui/layout";
import "./chat-history.css";

// 대표 화면 3번 대화 기록입니다. ChatGPT·Gemini·Claude 홈(2026년 10월)의 구성을 따릅니다.
// 사이드바(서비스 이름 → 주요 이동 → 고정됨 → 최근 → 프로필)와, 본문(시작 화면 또는 대화 보기)입니다.
// 화면 배치는 chat-history.css에 토큰으로만 적습니다.

type Conversation = {
  id: string;
  title: string;
  group: string;
  pinned?: boolean;
  messages: { from: "user" | "assistant"; text: string }[];
};

const shortConversations: Conversation[] = [
  {
    id: "c1",
    title: "여름방학 여행 계획 세우기",
    group: "오늘",
    pinned: true,
    messages: [
      { from: "user", text: "8월에 제주 3박 4일 가려는데 일정 좀 짜 줘." },
      {
        from: "assistant",
        text: "3박 4일이면 동부와 서부를 하루씩 나누는 게 편해요.\n\n1일차 공항 → 애월 해안도로 → 숙소\n2일차 성산일출봉 → 우도 → 섭지코지\n3일차 한라산 어리목 코스 → 제주시 야시장\n4일차 오설록 → 공항\n\n숙소부터 정할까요? 애월과 성산 중 어디가 좋으세요?",
      },
      { from: "user", text: "성산 쪽이 좋아. 비 오면 갈 곳도 알려 줘." },
      {
        from: "assistant",
        text: "성산으로 잡을게요. 비 오는 날에는 아쿠아플라넷, 김영갑갤러리, 성산 일대 카페거리가 가까워서 일정을 크게 바꾸지 않아도 돼요.",
      },
    ],
  },
  {
    id: "c2",
    title: "고양이 이름 추천",
    group: "오늘",
    messages: [
      { from: "user", text: "턱시도 고양이 이름 추천해 줘." },
      {
        from: "assistant",
        text: "보리, 쌀, 콩처럼 곡식 이름이 턱시도 무늬와 잘 어울려요. 부르기 쉬운 두 글자가 좋아요.",
      },
    ],
  },
  {
    id: "c3",
    title: "자기소개서 첫 문단 다듬기",
    group: "지난 7일",
    messages: [
      { from: "user", text: "첫 문단이 너무 뻔한 것 같아." },
      {
        from: "assistant",
        text: "첫 문장을 경험 중심으로 바꿔 봤어요. 지원 동기보다 직접 만든 결과를 먼저 보여 주면 읽는 사람이 끝까지 읽어요.",
      },
    ],
  },
  {
    id: "c4",
    title: "React 상태 관리 질문",
    group: "지난 7일",
    messages: [
      { from: "user", text: "서버에서 받은 데이터도 전역 상태로 둬야 해?" },
      {
        from: "assistant",
        text: "서버 상태와 화면 상태는 나누는 게 좋아요. 서버 데이터는 캐시 계층에 두고, 열림·선택 같은 값만 화면 상태로 두세요.",
      },
    ],
  },
  {
    id: "c5",
    title: "주말 장보기 목록",
    group: "지난 7일",
    messages: [
      { from: "user", text: "냉장고에 달걀이랑 두부 있어. 장볼 거 정리해 줘." },
      {
        from: "assistant",
        text: "있는 재료를 빼고 정리했어요. 대파, 애호박, 우유, 식빵이면 이번 주 식단이 돼요.",
      },
    ],
  },
  {
    id: "c6",
    title: "하늘 프로젝트 기억 구조 정리",
    group: "이전",
    pinned: true,
    messages: [
      { from: "user", text: "기억을 어떻게 나눠 저장하면 좋을까?" },
      {
        from: "assistant",
        text: "사실, 선호, 진행 중인 일 세 갈래로 나누고 각 항목에 마지막 확인 날짜를 붙이면 오래된 기억을 정리하기 쉬워요.",
      },
    ],
  },
  {
    id: "c7",
    title: "영어 이메일 번역",
    group: "이전",
    messages: [
      { from: "user", text: "이 메일 정중하게 영어로 바꿔 줘." },
      {
        from: "assistant",
        text: "정중한 말투로 옮겼어요. 마지막 문단만 사실 관계를 확인해 주세요.",
      },
    ],
  },
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

const suggestions = [
  "여행 일정 짜기",
  "글 다듬기",
  "코드 설명",
  "이미지 만들기",
  "표로 정리",
];

const artifacts = [
  ["a1", "제주 3박 4일 일정표", "2시간 전", FileText],
  ["a2", "하늘섬 탐험 소개 이미지", "어제", ImageIcon],
  ["a3", "기억 구조 정리 문서", "10월 23일", FileText],
] as const;

const models = {
  fast: { name: "빠른 답변", note: "일상 질문에 빠르게 답해요" },
  deep: { name: "깊은 생각", note: "복잡한 문제를 오래 생각해요" },
} as const;
type ModelKey = keyof typeof models;

export type ChatHistoryState = "default" | "loading" | "empty" | "error";

function Composer({
  model,
  onModelChange,
  onSend,
  compact,
}: {
  model: ModelKey;
  onModelChange: (model: ModelKey) => void;
  onSend: (text: string) => void;
  compact?: boolean;
}) {
  const [text, setText] = useState("");
  return (
    <form
      className="cht-composer"
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
      }}
    >
      <Textarea
        rows={compact ? 2 : 3}
        variant="utility"
        aria-label="메시지"
        placeholder="무엇이든 물어보세요"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="cht-composer-tools">
        <IconButton
          icon={<Plus />}
          size="sm"
          variant="utility"
          circular
          aria-label="파일 올리기"
        />
        <Menu.Root>
          <Menu.Trigger
            render={<Button size="sm" variant="utility" />}
            aria-label={`답변 방식: ${models[model].name}`}
          >
            {models[model].name}
            <ChevronDown size={16} aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={4} align="start">
              <Menu.Popup size="sm">
                <Menu.RadioGroup
                  value={model}
                  onValueChange={(value) => onModelChange(value as ModelKey)}
                >
                  {(Object.keys(models) as ModelKey[]).map((key) => (
                    <Menu.RadioItem key={key} value={key}>
                      {models[key].name}
                      <Menu.RadioItemIndicator>
                        <Check size={16} aria-hidden="true" />
                      </Menu.RadioItemIndicator>
                    </Menu.RadioItem>
                  ))}
                </Menu.RadioGroup>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
        <span className="cht-spacer" />
        <IconButton
          icon={<Mic />}
          size="sm"
          variant="utility"
          circular
          aria-label="음성으로 말하기"
        />
        <IconButton
          icon={<ArrowUp />}
          size="sm"
          circular
          type="submit"
          disabled={!text.trim()}
          aria-label="보내기"
        />
      </div>
      {!compact && (
        <p className="cht-composer-foot">
          <span>{models[model].note}</span>
          <span>Enter로 보내고, Shift+Enter로 줄을 바꿔요.</span>
        </p>
      )}
    </form>
  );
}

function History({
  state,
  longText,
  sidebarOpen,
}: {
  state: ChatHistoryState;
  longText: boolean;
  sidebarOpen: boolean;
}) {
  const toast = Toast.useToastManager();
  const [status, setStatus] = useState(state);
  const [conversations, setConversations] = useState(() =>
    state !== "default"
      ? []
      : longText
        ? longConversations
        : shortConversations,
  );
  const [selected, setSelected] = useState(state === "default" ? "c1" : "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(sidebarOpen);
  const [model, setModel] = useState<ModelKey>("fast");
  const [showAll, setShowAll] = useState(false);
  const [renaming, setRenaming] = useState<Conversation>();
  const [deleting, setDeleting] = useState<Conversation>();
  const newChat = useRef<HTMLButtonElement>(null);
  const renameInput = useRef<HTMLInputElement>(null);
  const visible = conversations.filter((conversation) =>
    conversation.title.includes(query.trim()),
  );
  const pinned = visible.filter((conversation) => conversation.pinned);
  const current = conversations.find(
    (conversation) => conversation.id === selected,
  );

  function retry() {
    setStatus("loading");
    setTimeout(() => {
      setConversations(longText ? longConversations : shortConversations);
      setStatus("default");
    }, 800);
  }

  function remove(target: Conversation) {
    const index = conversations.indexOf(target);
    setConversations((list) => list.filter((item) => item.id !== target.id));
    setSelected("");
    toast.add({
      title: "대화를 삭제했습니다",
      timeout: 10000,
      actionProps: {
        children: "실행 취소",
        onClick: () => {
          setConversations((list) => [
            ...list.slice(0, index),
            target,
            ...list.slice(index),
          ]);
          setSelected(target.id);
        },
      },
    });
  }

  function send(text: string) {
    toast.add({ title: "메시지를 보냈습니다", description: text });
  }

  function conversationItem(conversation: Conversation) {
    return (
      <Sidebar.Item key={conversation.id}>
        <Sidebar.Link
          href={`#chat-${conversation.id}`}
          active={conversation.id === selected}
          onClick={(event) => {
            event.preventDefault();
            setSelected(conversation.id);
            setOpen(false);
          }}
        >
          {conversation.title}
        </Sidebar.Link>
      </Sidebar.Item>
    );
  }

  let list;
  if (status === "loading") {
    list = (
      <Stack
        gap={8}
        role="status"
        aria-busy="true"
        aria-label="대화 기록을 불러오는 중"
      >
        {[0, 1, 2, 3, 4, 5].map((key) => (
          <Skeleton key={key} style={{ height: 36, borderRadius: 8 }} />
        ))}
      </Stack>
    );
  } else if (status === "error") {
    list = (
      <div className="cht-side-state" role="alert">
        <p>대화 기록을 불러오지 못했습니다.</p>
        <Button size="sm" variant="standard" onClick={retry}>
          다시 시도
        </Button>
      </div>
    );
  } else if (conversations.length === 0) {
    list = (
      <div className="cht-side-state">
        <p>아직 대화가 없습니다. 아래 입력창에서 첫 대화를 시작해 보세요.</p>
      </div>
    );
  } else if (visible.length === 0) {
    list = (
      <div className="cht-side-state" role="status">
        <p>‘{query}’와 일치하는 대화가 없습니다.</p>
        <Button size="sm" variant="standard" onClick={() => setQuery("")}>
          검색어 지우기
        </Button>
      </div>
    );
  } else {
    // 행마다 더보기 버튼을 둘 자리가 없어(2차 2-M1), 열린 대화의 머리에서 이름 바꾸기·삭제를 합니다.
    list = (
      <nav aria-label="대화 목록">
        {pinned.length > 0 && (
          <Sidebar.Group>
            <Sidebar.GroupLabel>고정됨</Sidebar.GroupLabel>
            <Sidebar.Menu>{pinned.map(conversationItem)}</Sidebar.Menu>
          </Sidebar.Group>
        )}
        {groups.map((group) => {
          const items = visible.filter(
            (conversation) =>
              conversation.group === group && !conversation.pinned,
          );
          if (items.length === 0) return null;
          const shown = showAll || group !== "이전" ? items : items.slice(0, 1);
          return (
            <Sidebar.Group key={group}>
              <div className="cht-group-head">
                <Sidebar.GroupLabel>{group}</Sidebar.GroupLabel>
                {group === "이전" && items.length > shown.length && (
                  <button
                    type="button"
                    className="cht-see-all"
                    onClick={() => setShowAll(true)}
                  >
                    모두 보기
                  </button>
                )}
              </div>
              <Sidebar.Menu>{shown.map(conversationItem)}</Sidebar.Menu>
            </Sidebar.Group>
          );
        })}
      </nav>
    );
  }

  return (
    <Sidebar.Provider open={open} onOpenChange={setOpen}>
      <div className="cht">
        <Sidebar.Panel title="대화 기록" closeLabel="대화 기록 닫기">
          <Sidebar.Header>
            <div className="cht-side-head">
              <p className="cht-brand">
                <strong>하늘</strong>
                <IconButton
                  icon={<PanelLeft />}
                  size="sm"
                  variant="utility"
                  aria-label="사이드바 접기"
                  onClick={() => setOpen(false)}
                />
              </p>
              <Sidebar.Action
                ref={newChat}
                icon="icon-regular-plus-large"
                active={selected === ""}
                onClick={() => {
                  setSelected("");
                  setOpen(false);
                }}
              >
                새 대화
              </Sidebar.Action>
              <Input
                type="search"
                aria-label="대화 검색"
                placeholder="대화 검색"
                controlSize="md"
                value={query}
                onValueChange={setQuery}
                leading={<Search size={16} aria-hidden="true" />}
                disabled={conversations.length === 0}
              />
              <Sidebar.Menu>
                <Sidebar.Item>
                  <Sidebar.Action leading={<Library size={20} />}>
                    라이브러리
                  </Sidebar.Action>
                </Sidebar.Item>
                <Sidebar.Item>
                  <Sidebar.Action
                    leading={<Folder size={20} />}
                    trailing={
                      <Badge size="xs" variant="emphasis">
                        신규
                      </Badge>
                    }
                  >
                    프로젝트
                  </Sidebar.Action>
                </Sidebar.Item>
              </Sidebar.Menu>
            </div>
          </Sidebar.Header>
          <Sidebar.Content>{list}</Sidebar.Content>
          <Sidebar.Footer>
            <Menu.Root>
              <Menu.Trigger
                render={<button type="button" className="cht-profile" />}
              >
                <Avatar.Root>
                  <Avatar.Fallback>바</Avatar.Fallback>
                </Avatar.Root>
                <span>
                  <strong>바보리보</strong>
                  <span>무료 요금제</span>
                </span>
                <ChevronDown size={16} aria-hidden="true" />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={4} align="start">
                  <Menu.Popup size="sm">
                    <Menu.Item>설정</Menu.Item>
                    <Menu.Item>기억 관리</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item>
                      <Sparkles size={16} aria-hidden="true" />
                      요금제 올리기
                    </Menu.Item>
                    <Menu.Item>로그아웃</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Sidebar.Footer>
        </Sidebar.Panel>

        <div className="cht-main">
          <div className="cht-topbar">
            <Sidebar.Trigger
              render={
                <IconButton
                  icon={<PanelLeft />}
                  variant="utility"
                  aria-label="대화 기록 열기"
                />
              }
            />
            <h1 className="cht-topbar-title">{current?.title ?? "새 대화"}</h1>
            {current && (
              <>
                <Button
                  size="sm"
                  variant="utility"
                  onClick={() =>
                    toast.add({ title: "공유 링크를 만들었습니다" })
                  }
                >
                  <Share2 size={16} aria-hidden="true" />
                  공유
                </Button>
                <Menu.Root>
                  <Menu.Trigger
                    render={
                      <IconButton
                        icon={<MoreHorizontal />}
                        variant="utility"
                        aria-label="대화 옵션"
                      />
                    }
                  />
                  <Menu.Portal>
                    <Menu.Positioner sideOffset={4} align="end">
                      <Menu.Popup size="sm">
                        <Menu.Item onClick={() => setRenaming(current)}>
                          <PencilLine size={16} aria-hidden="true" />
                          이름 바꾸기
                        </Menu.Item>
                        <Menu.Item
                          onClick={() =>
                            toast.add({
                              title: current.pinned
                                ? "고정을 해제했습니다"
                                : "대화를 고정했습니다",
                            })
                          }
                        >
                          <Pin size={16} aria-hidden="true" />
                          {current.pinned ? "고정 해제" : "고정하기"}
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item onClick={() => setDeleting(current)}>
                          <Trash2 size={16} aria-hidden="true" />
                          삭제
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </>
            )}
          </div>

          <div className="cht-scroll">
            {current ? (
              <div className="cht-thread">
                {current.messages.map((message, index) => (
                  <article
                    className="cht-msg"
                    data-from={message.from}
                    key={index}
                    aria-label={message.from === "user" ? "내 메시지" : "답변"}
                  >
                    <p>{message.text}</p>
                    {message.from === "assistant" && (
                      <div className="cht-msg-actions">
                        <IconButton
                          icon={<Copy />}
                          size="xs"
                          variant="utility"
                          aria-label="답변 복사"
                          onClick={() =>
                            toast.add({ title: "답변을 복사했습니다" })
                          }
                        />
                        <IconButton
                          icon={<RefreshCw />}
                          size="xs"
                          variant="utility"
                          aria-label="다시 답변 받기"
                        />
                        <IconButton
                          icon={<ThumbsUp />}
                          size="xs"
                          variant="utility"
                          aria-label="좋은 답변"
                        />
                        <IconButton
                          icon={<ThumbsDown />}
                          size="xs"
                          variant="utility"
                          aria-label="아쉬운 답변"
                        />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="cht-start">
                <p className="cht-greeting">
                  <Sparkles size={28} aria-hidden="true" />
                  오늘은 무엇을 해 볼까요?
                </p>
                <Composer
                  model={model}
                  onModelChange={setModel}
                  onSend={send}
                />
                <div className="cht-suggestions">
                  {suggestions.map((item) => (
                    <Button
                      key={item}
                      size="sm"
                      variant="standard"
                      onClick={() => send(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <section aria-labelledby="cht-recent">
                  <div className="cht-recent-head">
                    <h2 id="cht-recent">최근 만든 것</h2>
                    <Button size="sm" variant="utility">
                      모두 보기
                    </Button>
                  </div>
                  <ul className="cht-cards">
                    {artifacts.map(([id, title, when, ArtIcon]) => (
                      <li className="cht-card" key={id}>
                        <span className="cht-card-art">
                          <ArtIcon size={24} aria-hidden="true" />
                        </span>
                        <a href={`#artifact-${id}`}>{title}</a>
                        <time>{when}</time>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </div>

          {current && (
            <div className="cht-composer-dock">
              <Composer
                model={model}
                onModelChange={setModel}
                onSend={send}
                compact
              />
            </div>
          )}
        </div>
      </div>

      <Dialog.Root
        open={Boolean(renaming)}
        onOpenChange={(next) => !next && setRenaming(undefined)}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          {/* 입력 대화상자라 닫기 버튼 대신 입력칸에 먼저 포커스를 둡니다(2차 2-H2). */}
          <Dialog.Popup size="sm" initialFocus={renameInput}>
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
                <Stack gap={16}>
                  <Dialog.Title>대화 이름 바꾸기</Dialog.Title>
                  <Field.Root name="title">
                    <Field.Label>새 이름</Field.Label>
                    <Field.Control
                      ref={renameInput}
                      defaultValue={renaming?.title}
                      required
                      maxLength={60}
                    />
                    <Field.Error match="valueMissing">
                      이름을 입력하세요.
                    </Field.Error>
                  </Field.Root>
                </Stack>
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
          {/* 지운 대화의 메뉴 버튼이 사라지므로 포커스를 "새 대화"로 보냅니다(2차 2-H2). */}
          <AlertDialog.Popup finalFocus={newChat}>
            <Stack gap={24}>
              <Stack gap={8}>
                <AlertDialog.Title>대화를 삭제할까요?</AlertDialog.Title>
                <AlertDialog.Description>
                  ‘{deleting?.title}’ 대화와 이 대화에서 만든 기억이 함께
                  삭제됩니다.
                </AlertDialog.Description>
              </Stack>
              {/* AlertDialog에 작업 영역 파트가 없어 Inline으로 배치합니다(2차 2-M4). */}
              <Inline justify="end" gap={12}>
                <AlertDialog.Close render={<Button variant="standard" />}>
                  취소
                </AlertDialog.Close>
                <AlertDialog.Close
                  render={<Button variant="alert" />}
                  onClick={() => deleting && remove(deleting)}
                >
                  삭제
                </AlertDialog.Close>
              </Inline>
            </Stack>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Sidebar.Provider>
  );
}

export function ChatHistoryExample({
  state = "default",
  longText = false,
  sidebarOpen = false,
}: {
  /** 화면의 데이터 상태입니다. @defaultValue "default" */
  state?: ChatHistoryState;
  /** 긴 한국어 제목으로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
  /** 좁은 화면에서 대화 기록을 연 상태로 시작합니다. 넓은 화면은 항상 보입니다. @defaultValue false */
  sidebarOpen?: boolean;
}) {
  return (
    <Toast.Provider>
      <History
        key={`${state}-${longText}-${sidebarOpen}`}
        state={state}
        longText={longText}
        sidebarOpen={sidebarOpen}
      />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
