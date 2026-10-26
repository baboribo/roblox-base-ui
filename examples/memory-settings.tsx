"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ChevronRight,
  Download,
  ImageUp,
  PencilLine,
  Search,
  Trash2,
} from "lucide-react";
import { NavigationItem } from "../src/components/ui/navigation-item";
import { Switch } from "../src/components/ui/switch";
import { Slider } from "../src/components/ui/slider";
import { Dialog } from "../src/components/ui/dialog";
import { AlertDialog } from "../src/components/ui/alert-dialog";
import { Toast } from "../src/components/ui/toast";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Select } from "../src/components/ui/select";
import { Input } from "../src/components/ui/input";
import { Textarea } from "../src/components/ui/textarea";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Skeleton } from "../src/components/ui/skeleton";
import { Inline, Stack } from "../src/components/ui/layout";
import "./memory-settings.css";

// 대표 화면 4번 기억·설정입니다. Claude 설정 메모리와 ChatGPT 개인 맞춤 설정(2026년 10월)의 구성을 따릅니다.
// 왼쪽 설정 목록 + 오른쪽 묶음 상자(제목·설명·‘자세히 알아보기’·오른쪽 조작)입니다.
// 화면 배치는 memory-settings.css에 토큰으로만 적습니다.

type Memory = { id: string; topic: string; summary: string; date: string };

const shortMemories: Memory[] = [
  {
    id: "m1",
    topic: "나",
    summary: "고양이 두 마리(보리, 쌀)와 함께 살고, 주말마다 공원을 걷는다",
    date: "10월 24일",
  },
  {
    id: "m2",
    topic: "답변 방식",
    summary: "짧고 존댓말로, 결론을 먼저 말해 주기를 바란다",
    date: "10월 20일",
  },
  {
    id: "m3",
    topic: "코딩",
    summary: "React와 TypeScript로 개인 프로젝트를 만든다",
    date: "10월 12일",
  },
  {
    id: "m4",
    topic: "기기",
    summary: "갤럭시 Z 폴드와 맥북을 함께 쓴다",
    date: "10월 11일",
  },
];

// 긴 한국어 조건: 띄어쓰기 없는 긴 단어와 여러 줄 문장을 함께 확인합니다.
const longMemories: Memory[] = shortMemories.map((memory, index) => ({
  ...memory,
  topic:
    index % 2 === 0 ? memory.topic : `${memory.topic}관련아주긴주제이름입니다`,
  summary:
    index % 2 === 0
      ? `${memory.summary}. 그리고 주말마다 동네 공원에서 산책을 하면서 그날 있었던 일을 정리하는 습관이 있어서 대화를 시작할 때 오늘 하루가 어땠는지 먼저 물어봐 주기를 바란다.`
      : `${memory.summary.replaceAll(" ", "")}개인프로젝트하늘의기억압축규칙`,
}));

const tones = [
  { value: "friendly", label: "다정하게" },
  { value: "formal", label: "정중하게" },
  { value: "brief", label: "짧게" },
];

const traits = [
  ["따뜻함", ["기본값", "조금 더", "많이"]],
  ["열정", ["기본값", "차분하게", "들뜨게"]],
  ["이모지 사용", ["기본값", "쓰지 않기", "자주"]],
] as const;

function wallpaper(hue: number) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 72%)"/><stop offset="1" stop-color="hsl(${hue + 40} 60% 52%)"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><circle cx="480" cy="90" r="48" fill="white" opacity=".7"/><path d="m0 300 160-90 120 60 140-110 220 140v60H0z" fill="hsl(${hue} 40% 30%)" opacity=".6"/></svg>`,
    )
  );
}

const presets = [210, 25, 140, 290, 320];

export type MemorySettingsState = "default" | "loading" | "empty" | "error";

function Row({
  title,
  description,
  learnMore,
  children,
}: {
  title: string;
  description?: string;
  learnMore?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mst-row">
      <div className="mst-row-copy">
        <strong>{title}</strong>
        {description && (
          <p>
            {description} {learnMore && <a href="#help">자세히 알아보기</a>}
          </p>
        )}
      </div>
      <div className="mst-row-control">{children}</div>
    </div>
  );
}

function SettingSwitch({
  checked,
  onCheckedChange,
  label,
  ref,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <Switch.Root
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
    >
      <Switch.Thumb />
    </Switch.Root>
  );
}

function MemoryPanel({
  state,
  longText,
}: {
  state: MemorySettingsState;
  longText: boolean;
}) {
  const toast = Toast.useToastManager();
  const [status, setStatus] = useState(state);
  const [enabled, setEnabled] = useState(true);
  const [search, setSearch] = useState(true);
  const [sensitive, setSensitive] = useState(false);
  const [memories, setMemories] = useState(() =>
    state === "empty" ? [] : longText ? longMemories : shortMemories,
  );
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<Memory>();
  const [deleting, setDeleting] = useState<Memory | "all">();
  const editInput = useRef<HTMLTextAreaElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  function retry() {
    setStatus("loading");
    setTimeout(() => {
      setMemories(longText ? longMemories : shortMemories);
      setStatus("default");
    }, 800);
  }

  let body;
  if (status === "loading") {
    body = (
      <div
        className="mst-skeletons"
        role="status"
        aria-busy="true"
        aria-label="기억을 불러오는 중"
      >
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} style={{ height: 32, borderRadius: 8 }} />
        ))}
      </div>
    );
  } else if (status === "error") {
    body = (
      <div className="mst-state" role="alert">
        <p>기억을 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.</p>
        <Button size="sm" variant="standard" onClick={retry}>
          다시 시도
        </Button>
      </div>
    );
  } else if (memories.length === 0) {
    body = (
      <div className="mst-state">
        <p>
          아직 기억한 내용이 없습니다. 대화 중에 “이걸 기억해 줘”라고 말하거나,
          아래에 직접 적어 보세요.
        </p>
      </div>
    );
  } else {
    body = (
      <div className="mst-topics">
        {memories.map((memory) => (
          <div className="mst-topic" key={memory.id}>
            <strong>{memory.topic}</strong>
            <span className="mst-topic-summary">{memory.summary}</span>
            <time>{memory.date} 업데이트됨</time>
            <span className="mst-topic-actions">
              <IconButton
                icon={<PencilLine />}
                size="sm"
                variant="utility"
                aria-label={`${memory.topic} 기억 고치기`}
                onClick={() => setEditing(memory)}
              />
              <IconButton
                icon={<Trash2 />}
                size="sm"
                variant="utility"
                aria-label={`${memory.topic} 기억 지우기`}
                onClick={() => setDeleting(memory)}
              />
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Stack gap={48}>
      <section className="mst-group" aria-labelledby="mst-memory-group">
        <h2 className="mst-group-title" id="mst-memory-group">
          기억
        </h2>
        <p className="mst-group-note">
          기억을 어떻게 만들고 활용할지 정합니다.
        </p>
        <div className="mst-rows">
          <Row
            title="기억 사용"
            description="대화에서 알게 된 내용을 다음 대화에 활용합니다."
            learnMore
          >
            <SettingSwitch
              ref={toggle}
              label="기억 사용"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </Row>
          <Row
            title="지난 대화 검색"
            description="필요할 때 이전 대화에서 관련 내용을 찾아 참고합니다."
          >
            <SettingSwitch
              label="지난 대화 검색"
              checked={search}
              onCheckedChange={setSearch}
            />
          </Row>
          <Row
            title="민감한 주제도 기억"
            description="건강·신념처럼 민감한 내용까지 저장할지 정합니다."
            learnMore
          >
            <SettingSwitch
              label="민감한 주제도 기억"
              checked={sensitive}
              onCheckedChange={setSensitive}
            />
          </Row>
          <Row
            title="기억 내보내기"
            description="저장된 기억을 Markdown 파일이 담긴 .zip으로 내려받습니다."
          >
            <Button
              size="sm"
              variant="standard"
              onClick={() => toast.add({ title: "내보내기를 시작했습니다" })}
            >
              <Download size={16} aria-hidden="true" />
              내보내기
            </Button>
          </Row>
          <Row title="모든 기억 지우기" description="되돌릴 수 없습니다.">
            <Button
              size="sm"
              variant="alert"
              disabled={memories.length === 0}
              onClick={() => setDeleting("all")}
            >
              지우기
            </Button>
          </Row>
        </div>
      </section>

      <section className="mst-group" aria-labelledby="mst-topics-group">
        <h2 className="mst-group-title" id="mst-topics-group">
          저장된 기억 {memories.length > 0 && `${memories.length}개`}
        </h2>
        <div className="mst-rows">
          {body}
          <form
            className="mst-add"
            onSubmit={(event) => {
              event.preventDefault();
              const text = draft.trim();
              if (!text) return;
              setMemories((list) => [
                {
                  id: `n${list.length}`,
                  topic: "나",
                  summary: text,
                  date: "오늘",
                },
                ...list,
              ]);
              setDraft("");
              toast.add({ title: "기억을 추가했습니다" });
            }}
          >
            <Input
              aria-label="기억할 내용"
              placeholder="예: 제 강아지 이름은 콩이에요"
              controlSize="md"
              variant="utility"
              value={draft}
              onValueChange={setDraft}
            />
            <IconButton
              icon={<ArrowUp />}
              size="sm"
              circular
              type="submit"
              disabled={!draft.trim()}
              aria-label="기억 추가"
            />
          </form>
        </div>
      </section>

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
                const summary = String(
                  new FormData(event.currentTarget).get("memory"),
                ).trim();
                setMemories((list) =>
                  list.map((item) =>
                    item.id === editing?.id ? { ...item, summary } : item,
                  ),
                );
                setEditing(undefined);
              }}
            >
              <Dialog.Body>
                <Stack gap={16}>
                  <Dialog.Title>기억 고치기</Dialog.Title>
                  <Dialog.Description>
                    주제: {editing?.topic}
                  </Dialog.Description>
                  {/* Textarea는 Field.Control render로 연결합니다(2차 2-M5). */}
                  <Field.Root name="memory">
                    <Field.Label>내용</Field.Label>
                    <Field.Control
                      ref={editInput}
                      render={<Textarea rows={4} />}
                      defaultValue={editing?.summary}
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

function WallpaperPanel() {
  const toast = Toast.useToastManager();
  const [hue, setHue] = useState(210);
  const [src, setSrc] = useState(() => wallpaper(210));
  const [blur, setBlur] = useState(8);
  const [opacity, setOpacity] = useState(60);
  const [dim, setDim] = useState(true);
  const file = useRef<HTMLInputElement>(null);
  // 올린 파일의 미리보기 주소를 정리합니다.
  useEffect(
    () => () => {
      if (src.startsWith("blob:")) URL.revokeObjectURL(src);
    },
    [src],
  );
  return (
    <Stack gap={48}>
      <section className="mst-group" aria-labelledby="mst-wall-group">
        <h2 className="mst-group-title" id="mst-wall-group">
          채팅 배경
        </h2>
        <p className="mst-group-note">
          대화 화면 뒤에 보이는 배경입니다. 글자가 잘 보이는지 미리보기에서
          확인하세요.
        </p>
        {/* Wallpaper 컴포넌트(6단계)가 없어 미리보기를 화면에서 만듭니다(2차 2-M14). */}
        <div className="mst-wall">
          <img
            src={src}
            alt="채팅 배경 미리보기"
            style={{
              filter: `blur(${blur}px)`,
              opacity: opacity / 100,
            }}
          />
          <p className="mst-wall-bubble">이렇게 보여요</p>
        </div>
        <div className="mst-rows">
          <div className="mst-presets" role="group" aria-label="기본 배경">
            {presets.map((value) => (
              <button
                key={value}
                type="button"
                className="mst-preset"
                aria-pressed={hue === value && !src.startsWith("blob:")}
                aria-label={`기본 배경 ${presets.indexOf(value) + 1}`}
                onClick={() => {
                  setHue(value);
                  setSrc(wallpaper(value));
                }}
              >
                <img src={wallpaper(value)} alt="" />
              </button>
            ))}
          </div>
          <Row
            title="내 사진 사용"
            description="이미지, GIF, MP4 파일을 20MB까지 올릴 수 있습니다."
          >
            {/* 파일 올리기 컴포넌트(5단계)가 없어 숨긴 input을 버튼으로 엽니다(2차 2-M13). */}
            <Button
              size="sm"
              variant="standard"
              onClick={() => file.current?.click()}
            >
              <ImageUp size={16} aria-hidden="true" />
              배경 올리기
            </Button>
          </Row>
          <Row
            title="글자 뒤 어둡게"
            description="밝은 배경에서도 글자가 읽히도록 뒤를 조금 어둡게 합니다."
          >
            <SettingSwitch
              label="글자 뒤 어둡게"
              checked={dim}
              onCheckedChange={setDim}
            />
          </Row>
          <div className="mst-sliders">
            {(
              [
                ["흐림", blur, setBlur, 20, "px"],
                ["불투명도", opacity, setOpacity, 100, "%"],
              ] as const
            ).map(([label, value, setValue, max, unit]) => (
              <Slider.Root
                key={label}
                value={value}
                onValueChange={(next) => setValue(next as number)}
                min={0}
                max={max}
              >
                <Inline justify="space-between" gap={12}>
                  <Slider.Label>{label}</Slider.Label>
                  <Slider.Value>
                    {(_, current) => `${current}${unit}`}
                  </Slider.Value>
                </Inline>
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Indicator />
                    {/* Label이 입력에 연결되지 않아 같은 이름을 한 번 더 줍니다(2차 2-M7). */}
                    <Slider.Thumb aria-label={label} />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
            ))}
          </div>
        </div>
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
      </section>
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
  const [trait, setTrait] = useState<Record<string, string>>({});
  return (
    <Stack gap={48}>
      <section className="mst-group" aria-labelledby="mst-about-group">
        <h2 className="mst-group-title" id="mst-about-group">
          나에 대해
        </h2>
        <p className="mst-group-note">
          모든 대화에 적용할 지침과 맥락을 알려 주세요.
        </p>
        <div className="mst-rows">
          <Form
            className="mst-form"
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
            <Field.Root name="job">
              <Field.Label>하는 일</Field.Label>
              <Field.Control placeholder="예: 개인 프로젝트를 만드는 학생" />
            </Field.Root>
            <Select
              label="기본 말투"
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
            <div className="mst-actions">
              <Button type="submit" size="md">
                저장
              </Button>
            </div>
          </Form>
        </div>
      </section>

      <section className="mst-group" aria-labelledby="mst-style-group">
        <h2 className="mst-group-title" id="mst-style-group">
          성격 다듬기
        </h2>
        <div className="mst-rows">
          {traits.map(([label, options]) => (
            <Row key={label} title={label}>
              <Select
                label={label}
                options={options.map((option) => ({
                  value: option,
                  label: option,
                }))}
                size="sm"
                value={trait[label] ?? options[0]}
                onValueChange={(value) =>
                  setTrait({ ...trait, [label]: value as string })
                }
              />
            </Row>
          ))}
        </div>
      </section>

      <section className="mst-group" aria-labelledby="mst-data-group">
        <h2 className="mst-group-title" id="mst-data-group">
          데이터 관리
        </h2>
        <div className="mst-rows">
          {[
            ["참고 사진", "내 모습을 담은 이미지를 만들 때 참고합니다"],
            ["연결된 앱", "캘린더·메일에서 맥락을 가져옵니다"],
            ["내 데이터 내려받기", "대화와 기억을 한 번에 내려받습니다"],
          ].map(([title, description]) => (
            <button
              key={title}
              type="button"
              className="mst-row-link"
              onClick={() => toast.add({ title: `${title} 화면으로 이동` })}
            >
              <span className="mst-row-copy">
                <strong>{title}</strong>
                <span>{description}</span>
              </span>
              <ChevronRight
                className="mst-chevron"
                size={20}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </section>
    </Stack>
  );
}

const sections = [
  {
    value: "memory",
    label: "기억",
    group: "환경설정",
    note: "AI가 나에 대해 무엇을 기억하고 어떻게 쓸지 정합니다.",
  },
  {
    value: "wallpaper",
    label: "배경",
    group: "환경설정",
    note: "대화 화면의 배경과 글자가 보이는 방식을 정합니다.",
  },
  {
    value: "profile",
    label: "나에 대해",
    group: "사용자 지정",
    note: "모든 대화에 적용할 지침과 말투를 정합니다.",
  },
] as const;

export function MemorySettingsExample({
  state = "default",
  longText = false,
  tab = "memory",
}: {
  /** 처음 열리는 설정 항목입니다. @defaultValue "memory" */
  tab?: "memory" | "wallpaper" | "profile";
  /** 기억 목록의 데이터 상태입니다. error는 입력 폼의 서버 오류도 함께 보여 줍니다. @defaultValue "default" */
  state?: MemorySettingsState;
  /** 긴 한국어 기억으로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
}) {
  const [section, setSection] = useState<string>(tab);
  const [query, setQuery] = useState("");
  const found = sections.filter((item) => item.label.includes(query.trim()));
  const current = sections.find((item) => item.value === section);
  return (
    <Toast.Provider>
      <div className="mst" key={`${state}-${longText}-${tab}`}>
        <div className="mst-nav">
          <div className="mst-nav-head">
            <p className="mst-nav-title">설정</p>
            <Input
              type="search"
              aria-label="설정 검색"
              placeholder="검색"
              controlSize="md"
              value={query}
              onValueChange={setQuery}
              leading={<Search size={16} aria-hidden="true" />}
            />
          </div>
          {/* Tabs의 세로 탭은 글자가 가운데로 모여 설정 목록처럼 보이지 않아, 탐색 항목으로 만듭니다(3.5단계 N10). */}
          <nav aria-label="설정 항목">
            {["환경설정", "사용자 지정"].map((group) => {
              const items = found.filter((item) => item.group === group);
              if (items.length === 0) return null;
              return (
                <div className="mst-nav-section" key={group}>
                  <p className="mst-nav-group">{group}</p>
                  <ul>
                    {items.map((item) => (
                      <li key={item.value}>
                        <NavigationItem
                          active={item.value === section}
                          onClick={() => setSection(item.value)}
                        >
                          {item.label}
                        </NavigationItem>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {found.length === 0 && (
              <p className="mst-nav-group">‘{query}’와 맞는 설정이 없습니다.</p>
            )}
          </nav>
        </div>

        <div className="mst-content">
          <div className="mst-inner">
            <div className="mst-head">
              <h1 className="mst-h1">{current?.label}</h1>
              <p>{current?.note}</p>
            </div>
            {section === "memory" && (
              <MemoryPanel state={state} longText={longText} />
            )}
            {section === "wallpaper" && <WallpaperPanel />}
            {section === "profile" && <ProfilePanel state={state} />}
          </div>
        </div>
      </div>
      <Toast.Toaster />
    </Toast.Provider>
  );
}
