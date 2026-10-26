"use client";
import { useEffect, useState } from "react";
import { ImageUp, PencilLine, Trash2 } from "lucide-react";
import { Tabs } from "../src/components/ui/tabs";
import { List } from "../src/components/ui/list";
import { Switch } from "../src/components/ui/switch";
import { Slider } from "../src/components/ui/slider";
import { Dialog } from "../src/components/ui/dialog";
import { AlertDialog } from "../src/components/ui/alert-dialog";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Select } from "../src/components/ui/select";
import { Textarea } from "../src/components/ui/textarea";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Empty } from "../src/components/ui/empty";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { Heading, Text } from "../src/components/ui/typography";
import "./memory-settings.css";

// 3단계 점검용 조합입니다. 기존 컴포넌트만 사용하고, 빠진 부분은 화면 CSS로만 채웁니다.
// 화면 CSS로 채운 곳은 docs/engineering/SCREENS-AUDIT-2.md에 문제로 기록했습니다.

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
  const [enabled, setEnabled] = useState(true);
  const [memories, setMemories] = useState(() =>
    state === "empty" ? [] : longText ? longMemories : shortMemories,
  );
  const [editing, setEditing] = useState<Memory>();
  const [deleting, setDeleting] = useState<Memory | "all">();

  let body;
  if (state === "loading") {
    body = (
      <div className="ms-skeleton" aria-busy="true">
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="ms-skeleton-row" />
        ))}
      </div>
    );
  } else if (state === "error") {
    body = (
      <Alert>
        <AlertTitle>기억을 불러오지 못했습니다</AlertTitle>
        <AlertDescription>잠시 뒤 다시 시도해 주세요.</AlertDescription>
        <Button size="sm" variant="standard" className="ms-retry">
          다시 시도
        </Button>
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
      <List.Root variant="boxed">
        {memories.map((memory) => (
          <List.Item key={memory.id}>
            <List.Content
              trailing={
                <span className="ms-row-actions">
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
                </span>
              }
            >
              <List.Title className="ms-memory-text">{memory.text}</List.Title>
              <List.Description>{memory.date}에 저장</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List.Root>
    );
  }

  return (
    <section className="ms-section" aria-labelledby="ms-memory-title">
      <div className="ms-section-header">
        <h2 id="ms-memory-title" className="ms-section-title">
          AI 기억
        </h2>
        <Button
          size="sm"
          variant="alert"
          disabled={memories.length === 0 || state !== "default"}
          onClick={() => setDeleting("all")}
        >
          모두 지우기
        </Button>
      </div>
      <label className="ms-switch-row">
        <span>
          <span className="ms-switch-label">기억 사용</span>
          <span className="ms-help">
            대화에서 알게 된 내용을 다음 대화에 활용합니다.
          </span>
        </span>
        <Switch.Root checked={enabled} onCheckedChange={setEnabled}>
          <Switch.Thumb />
        </Switch.Root>
      </label>
      {body}

      <Dialog.Root
        open={Boolean(editing)}
        onOpenChange={(next) => !next && setEditing(undefined)}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="md">
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
                <Dialog.Title>기억 고치기</Dialog.Title>
                {/* Textarea는 Field.Control이 아니라서 Field의 라벨·오류 연결을 쓰려면 render로 바꿉니다. */}
                <Field.Root name="memory" className="ms-dialog-field">
                  <Field.Label>내용</Field.Label>
                  <Field.Control
                    render={<Textarea rows={4} />}
                    defaultValue={editing?.text}
                    required
                    maxLength={200}
                  />
                  <Field.Error match="valueMissing">
                    내용을 입력하세요. 지우려면 ‘기억 지우기’를 사용하세요.
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
            <div className="ms-alert-actions">
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
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </section>
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
  const [src, setSrc] = useState(() => wallpaper(210));
  const [blur, setBlur] = useState(8);
  const [opacity, setOpacity] = useState(60);
  const [fileError, setFileError] = useState("");
  // 올린 파일의 미리보기 주소를 정리합니다.
  useEffect(
    () => () => {
      if (src.startsWith("blob:")) URL.revokeObjectURL(src);
    },
    [src],
  );
  return (
    <section className="ms-section" aria-labelledby="ms-wallpaper-title">
      <h2 id="ms-wallpaper-title" className="ms-section-title">
        채팅 배경
      </h2>
      {/* 배경 미리보기: Wallpaper 컴포넌트(6단계)가 없어 화면 CSS로 겹칩니다. */}
      <div className="ms-preview" aria-hidden="true">
        <img
          src={src}
          alt=""
          className="ms-preview-image"
          style={{ filter: `blur(${blur}px)`, opacity: opacity / 100 }}
        />
        <span className="ms-preview-bubble">
          안녕하세요! 무엇을 도와드릴까요?
        </span>
      </div>
      {/* 파일 올리기 컴포넌트가 없어 label + 숨긴 input으로 만듭니다. */}
      <div className="ms-upload">
        <label
          className="rbx-button ms-upload-button"
          data-variant="standard"
          data-size="md"
        >
          <ImageUp size={18} aria-hidden="true" />
          배경 올리기
          <input
            type="file"
            accept="image/*,video/mp4"
            className="ms-visually-hidden"
            aria-describedby="ms-upload-help ms-upload-error"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (!file) return;
              if (file.size > 20 * 1024 * 1024) {
                setFileError("20MB 이하 파일만 올릴 수 있습니다.");
                return;
              }
              setFileError("");
              setSrc(URL.createObjectURL(file));
            }}
          />
        </label>
        <Button
          size="md"
          variant="utility"
          onClick={() => setSrc(wallpaper(210))}
        >
          기본 배경으로
        </Button>
      </div>
      <p id="ms-upload-help" className="ms-help">
        이미지, GIF, MP4 파일을 20MB까지 올릴 수 있습니다.
      </p>
      <p id="ms-upload-error" className="rbx-error" role="alert">
        {fileError}
      </p>
      <div className="ms-sliders">
        <Slider.Root
          value={blur}
          onValueChange={(value) => setBlur(value as number)}
          min={0}
          max={20}
        >
          <div className="ms-slider-head">
            <Slider.Label>흐림</Slider.Label>
            <Slider.Value>{(_, value) => `${value}px`}</Slider.Value>
          </div>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label="흐림" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <Slider.Root
          value={opacity}
          onValueChange={(value) => setOpacity(value as number)}
          min={0}
          max={100}
        >
          <div className="ms-slider-head">
            <Slider.Label>불투명도</Slider.Label>
            <Slider.Value>{(_, value) => `${value}%`}</Slider.Value>
          </div>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label="불투명도" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
      </div>
    </section>
  );
}

function ProfilePanel({ state }: { state: MemorySettingsState }) {
  const [saved, setSaved] = useState(false);
  // 오류 상태: 서버가 돌려준 필드 오류를 Form errors로 표시합니다.
  const [errors, setErrors] = useState<Record<string, string>>(
    state === "error"
      ? {
          nickname: "이미 다른 사람이 쓰는 이름입니다. 다른 이름을 입력하세요.",
        }
      : {},
  );
  return (
    <section className="ms-section" aria-labelledby="ms-profile-title">
      <h2 id="ms-profile-title" className="ms-section-title">
        나에 대해
      </h2>
      <Form
        className="ms-form"
        errors={errors}
        onSubmit={(event) => {
          event.preventDefault();
          setErrors({});
          setSaved(true);
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
        <div className="ms-form-actions">
          <Button type="submit" size="md">
            저장
          </Button>
        </div>
        {saved && <p role="status">저장했습니다.</p>}
      </Form>
    </section>
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
    <div className="ms-page" key={`${state}-${longText}-${tab}`}>
      <Heading>기억·설정</Heading>
      <Text className="ms-help">
        AI가 나를 어떻게 기억하고 보여 줄지 정합니다.
      </Text>
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
    </div>
  );
}
