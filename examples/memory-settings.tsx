"use client";
import { useEffect, useRef, useState } from "react";
import { ImageUp, PencilLine, Trash2 } from "lucide-react";
import { Tabs } from "../src/components/ui/tabs";
import { List } from "../src/components/ui/list";
import { Switch } from "../src/components/ui/switch";
import { Slider } from "../src/components/ui/slider";
import { Dialog } from "../src/components/ui/dialog";
import { AlertDialog } from "../src/components/ui/alert-dialog";
import { Toast } from "../src/components/ui/toast";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Select } from "../src/components/ui/select";
import { Textarea } from "../src/components/ui/textarea";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Card, CardImage, CardMedia } from "../src/components/ui/card";
import { Empty } from "../src/components/ui/empty";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { Inline, Stack } from "../src/components/ui/layout";
import { Heading, Text } from "../src/components/ui/typography";

// 대표 화면 4번 기억·설정입니다. 라이브러리 컴포넌트와 배치 컴포넌트만으로 조립합니다.
// 화면 CSS 파일은 두지 않고, 라이브러리에 없어 생긴 한계는 docs/engineering/SCREENS-AUDIT-2.md에 기록합니다.

type Memory = { id: string; text: string; date: string };

const shortMemories: Memory[] = [
  { id: "m1", text: "고양이 두 마리(보리, 쌀)를 키운다.", date: "10월 24일" },
  { id: "m2", text: "답변은 짧고 존댓말로 받기를 원한다.", date: "10월 20일" },
  {
    id: "m3",
    text: "React와 TypeScript로 개인 프로젝트를 만든다.",
    date: "10월 12일",
  },
];

// 긴 한국어 조건: 띄어쓰기 없는 긴 단어와 여러 줄 문장을 함께 확인합니다.
const longMemories: Memory[] = shortMemories.map((memory, index) => ({
  ...memory,
  text:
    index % 2 === 0
      ? `${memory.text} 그리고 주말마다 동네 공원에서 산책을 하면서 그날 있었던 일을 정리하는 습관이 있어서 대화를 시작할 때 오늘 하루가 어땠는지 먼저 물어봐 주기를 바란다.`
      : `${memory.text.replaceAll(" ", "")}개인프로젝트하늘의기억압축규칙`,
}));

const tones = [
  { value: "friendly", label: "다정하게" },
  { value: "formal", label: "정중하게" },
  { value: "brief", label: "짧게" },
];

export type MemorySettingsState = "default" | "loading" | "empty" | "error";

function MemoryPanel({
  state,
  longText,
}: {
  state: MemorySettingsState;
  longText: boolean;
}) {
  const [status, setStatus] = useState(state);
  const [enabled, setEnabled] = useState(true);
  const [memories, setMemories] = useState(() =>
    state === "empty" ? [] : longText ? longMemories : shortMemories,
  );
  const [editing, setEditing] = useState<Memory>();
  const [deleting, setDeleting] = useState<Memory | "all">();
  const editInput = useRef<HTMLTextAreaElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  let body;
  if (status === "loading") {
    body = (
      <Stack
        gap={12}
        role="status"
        aria-busy="true"
        aria-label="기억을 불러오는 중"
      >
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} style={{ height: 56, borderRadius: 8 }} />
        ))}
      </Stack>
    );
  } else if (status === "error") {
    body = (
      <Alert>
        <Stack gap={12} align="start">
          <div>
            <AlertTitle>기억을 불러오지 못했습니다</AlertTitle>
            <AlertDescription>잠시 뒤 다시 시도해 주세요.</AlertDescription>
          </div>
          <Button
            size="sm"
            variant="standard"
            onClick={() => {
              setStatus("loading");
              setTimeout(() => {
                setMemories(longText ? longMemories : shortMemories);
                setStatus("default");
              }, 800);
            }}
          >
            다시 시도
          </Button>
        </Stack>
      </Alert>
    );
  } else if (memories.length === 0) {
    body = (
      <Empty>
        <h3>아직 기억한 내용이 없습니다</h3>
        <p>대화 중에 “이걸 기억해 줘”라고 말하면 여기에 저장됩니다.</p>
      </Empty>
    );
  } else {
    body = (
      // 기억 본문 자리가 굵은 List.Title뿐이라 긴 문장도 굵게 보입니다(2차 2-L3).
      <List.Root>
        {memories.map((memory) => (
          <List.Item key={memory.id}>
            <List.Content
              trailing={
                <Inline gap={4} style={{ flexWrap: "nowrap" }}>
                  <IconButton
                    icon={<PencilLine />}
                    size="sm"
                    variant="utility"
                    aria-label="기억 고치기"
                    onClick={() => setEditing(memory)}
                  />
                  <IconButton
                    icon={<Trash2 />}
                    size="sm"
                    variant="utility"
                    aria-label="기억 지우기"
                    onClick={() => setDeleting(memory)}
                  />
                </Inline>
              }
            >
              <List.Title>{memory.text}</List.Title>
              <List.Description>{memory.date}에 저장</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List.Root>
    );
  }

  return (
    <Stack gap={24}>
      {/* Field가 라벨·설명을 스위치에 연결합니다. 설명이 이름에 섞이지 않습니다(2차 2-M6). */}
      <Field.Root>
        <Inline justify="space-between" gap={16} style={{ flexWrap: "nowrap" }}>
          <Stack gap={4}>
            <Field.Label>기억 사용</Field.Label>
            <Field.Description>
              대화에서 알게 된 내용을 다음 대화에 활용합니다.
            </Field.Description>
          </Stack>
          <Switch.Root
            ref={toggle}
            checked={enabled}
            onCheckedChange={setEnabled}
          >
            <Switch.Thumb />
          </Switch.Root>
        </Inline>
      </Field.Root>
      {body}
      {status === "default" && memories.length > 0 && (
        // ChatGPT처럼 전체 삭제는 목록 아래 덜 눈에 띄는 자리에 둡니다.
        <Inline>
          <Button
            size="md"
            variant="standard"
            onClick={() => setDeleting("all")}
          >
            모든 기억 지우기
          </Button>
        </Inline>
      )}

      <Dialog.Root
        open={Boolean(editing)}
        onOpenChange={(next) => !next && setEditing(undefined)}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="md" initialFocus={editInput}>
            <Dialog.CloseAffordance />
            <Form
              onSubmit={(event) => {
                event.preventDefault();
                const text = String(
                  new FormData(event.currentTarget).get("memory"),
                ).trim();
                setMemories((list) =>
                  list.map((item) =>
                    item.id === editing?.id ? { ...item, text } : item,
                  ),
                );
                setEditing(undefined);
              }}
            >
              <Dialog.Body>
                <Stack gap={16}>
                  <Dialog.Title>기억 고치기</Dialog.Title>
                  {/* Textarea는 Field.Control render로 연결합니다(2차 2-M5). */}
                  <Field.Root name="memory">
                    <Field.Label>내용</Field.Label>
                    <Field.Control
                      ref={editInput}
                      render={<Textarea rows={4} />}
                      defaultValue={editing?.text}
                      required
                      maxLength={200}
                    />
                    <Field.Error match="valueMissing">
                      내용을 입력하세요. 지우려면 ‘기억 지우기’를 사용하세요.
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
          {/* 지운 행의 버튼이 사라지므로 포커스를 "기억 사용" 스위치로 보냅니다(2차 2-H2). */}
          <AlertDialog.Popup finalFocus={toggle}>
            <Stack gap={24}>
              <Stack gap={8}>
                <AlertDialog.Title>
                  {deleting === "all"
                    ? "기억을 모두 지울까요?"
                    : "이 기억을 지울까요?"}
                </AlertDialog.Title>
                <AlertDialog.Description>
                  {deleting === "all"
                    ? `저장된 기억 ${memories.length}개가 모두 지워지고 되돌릴 수 없습니다.`
                    : "지운 기억은 되돌릴 수 없습니다."}
                </AlertDialog.Description>
              </Stack>
              <Inline justify="end" gap={12}>
                <AlertDialog.Close render={<Button variant="standard" />}>
                  취소
                </AlertDialog.Close>
                <AlertDialog.Close
                  render={<Button variant="alert" />}
                  onClick={() =>
                    setMemories((list) =>
                      deleting === "all"
                        ? []
                        : list.filter((item) => item !== deleting),
                    )
                  }
                >
                  지우기
                </AlertDialog.Close>
              </Inline>
            </Stack>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Stack>
  );
}

function wallpaper(hue: number) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 72%)"/><stop offset="1" stop-color="hsl(${hue + 40} 60% 52%)"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="480" cy="90" r="48" fill="#fff" opacity=".7"/><path d="m0 300 160-90 120 60 140-110 220 140v60H0z" fill="hsl(${hue} 40% 30%)" opacity=".6"/></svg>`,
    )
  );
}

function WallpaperPanel() {
  const toast = Toast.useToastManager();
  const [src, setSrc] = useState(() => wallpaper(210));
  const [blur, setBlur] = useState(8);
  const [opacity, setOpacity] = useState(60);
  const file = useRef<HTMLInputElement>(null);
  // 올린 파일의 미리보기 주소를 정리합니다.
  useEffect(
    () => () => {
      if (src.startsWith("blob:")) URL.revokeObjectURL(src);
    },
    [src],
  );
  return (
    <Stack gap={24}>
      {/* 배경 미리보기: Wallpaper 컴포넌트(6단계)가 없어 미디어만 있는 Card에 흐림·불투명도를 바로 적용합니다(2차 2-M14). */}
      <Card variant="plain">
        <CardMedia>
          <CardImage
            src={src}
            alt="채팅 배경 미리보기"
            style={{ filter: `blur(${blur}px)`, opacity: opacity / 100 }}
          />
        </CardMedia>
      </Card>
      <Stack gap={8}>
        <Inline gap={12}>
          {/* 파일 올리기 컴포넌트(5단계)가 없어 숨긴 input을 버튼으로 엽니다(2차 2-M13). */}
          <Button
            size="md"
            variant="standard"
            onClick={() => file.current?.click()}
          >
            <ImageUp size={18} aria-hidden="true" />
            배경 올리기
          </Button>
          <Button
            size="md"
            variant="utility"
            onClick={() => setSrc(wallpaper(210))}
          >
            기본 배경으로
          </Button>
        </Inline>
        <input
          ref={file}
          type="file"
          accept="image/*,video/mp4"
          hidden
          onChange={(event) => {
            const picked = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (!picked) return;
            if (picked.size > 20 * 1024 * 1024) {
              toast.add({
                title: "파일이 너무 큽니다",
                description: "20MB 이하 파일만 올릴 수 있습니다.",
                type: "error",
              });
              return;
            }
            setSrc(URL.createObjectURL(picked));
          }}
        />
        <Text>이미지, GIF, MP4 파일을 20MB까지 올릴 수 있습니다.</Text>
      </Stack>
      <Stack gap={24}>
        {[
          ["흐림", blur, setBlur, 20, "px"],
          ["불투명도", opacity, setOpacity, 100, "%"],
        ].map(([label, value, setValue, max, unit]) => (
          <Slider.Root
            key={label as string}
            value={value as number}
            onValueChange={(next) =>
              (setValue as (value: number) => void)(next as number)
            }
            min={0}
            max={max as number}
          >
            <Inline justify="space-between" gap={12}>
              <Slider.Label>{label as string}</Slider.Label>
              <Slider.Value>{(_, current) => `${current}${unit}`}</Slider.Value>
            </Inline>
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                {/* Label이 입력에 연결되지 않아 같은 이름을 한 번 더 줍니다(2차 2-M7). */}
                <Slider.Thumb aria-label={label as string} />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        ))}
      </Stack>
    </Stack>
  );
}

function ProfilePanel({ state }: { state: MemorySettingsState }) {
  const toast = Toast.useToastManager();
  // 오류 상태: 서버가 돌려준 필드 오류를 Form errors로 표시합니다.
  const [errors, setErrors] = useState<Record<string, string>>(
    state === "error"
      ? {
          nickname: "이미 다른 사람이 쓰는 이름입니다. 다른 이름을 입력하세요.",
        }
      : {},
  );
  return (
    <Form
      errors={errors}
      onSubmit={(event) => {
        event.preventDefault();
        setErrors({});
        toast.add({ title: "저장했습니다", type: "success" });
      }}
    >
      <Field.Root name="nickname">
        <Field.Label>AI가 부를 이름</Field.Label>
        <Field.Control defaultValue="바보리보" required maxLength={20} />
        <Field.Description>20자까지 쓸 수 있습니다.</Field.Description>
        <Field.Error match="valueMissing">이름을 입력하세요.</Field.Error>
        <Field.Error />
      </Field.Root>
      <Field.Root name="email">
        <Field.Label>알림 받을 이메일</Field.Label>
        <Field.Control type="email" placeholder="you@example.com" />
        <Field.Error match="typeMismatch">
          이메일 형식을 확인해 주세요. 예: you@example.com
        </Field.Error>
      </Field.Root>
      <Select
        label="말투"
        name="tone"
        options={tones}
        defaultValue="friendly"
      />
      <Field.Root name="about">
        <Field.Label>AI에게 알려 줄 내 소개</Field.Label>
        <Field.Control
          render={<Textarea rows={4} />}
          placeholder="관심사, 하는 일, 원하는 답변 방식 등을 적어 주세요."
          maxLength={500}
        />
        <Field.Description>500자까지 쓸 수 있습니다.</Field.Description>
      </Field.Root>
      <Inline justify="end">
        <Button type="submit" size="md">
          저장
        </Button>
      </Inline>
    </Form>
  );
}

export function MemorySettingsExample({
  state = "default",
  longText = false,
  tab = "memory",
}: {
  /** 처음 열리는 탭입니다. @defaultValue "memory" */
  tab?: "memory" | "wallpaper" | "profile";
  /** 기억 목록의 데이터 상태입니다. error는 입력 폼의 서버 오류도 함께 보여 줍니다. @defaultValue "default" */
  state?: MemorySettingsState;
  /** 긴 한국어 기억으로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
}) {
  return (
    <Toast.Provider>
      {/* 화면 폭과 바깥 여백은 앱 레이아웃의 몫이라 예제에서만 정합니다. */}
      <Stack
        key={`${state}-${longText}-${tab}`}
        gap={24}
        style={{ maxWidth: 720, marginInline: "auto", padding: "24px 16px" }}
      >
        <Stack gap={8}>
          {/* Heading은 h2만 있어 페이지 제목에 h1을 쓸 수 없습니다(1차 M7). */}
          <Heading>기억·설정</Heading>
          <Text>AI가 나를 어떻게 기억하고 보여 줄지 정합니다.</Text>
        </Stack>
        {/* 탭 이름이 곧 구역 이름이라 패널 안에 같은 제목을 다시 두지 않습니다. */}
        <Tabs.Root defaultValue={tab}>
          <Tabs.List aria-label="설정 종류">
            <Tabs.Tab value="memory">기억</Tabs.Tab>
            <Tabs.Tab value="wallpaper">배경</Tabs.Tab>
            <Tabs.Tab value="profile">나에 대해</Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel value="memory">
              <MemoryPanel state={state} longText={longText} />
            </Tabs.Panel>
            <Tabs.Panel value="wallpaper">
              <WallpaperPanel />
            </Tabs.Panel>
            <Tabs.Panel value="profile">
              <ProfilePanel state={state} />
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </Stack>
      <Toast.Toaster />
    </Toast.Provider>
  );
}
