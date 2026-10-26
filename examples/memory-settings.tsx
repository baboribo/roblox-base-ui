"use client";
import { useEffect, useRef, useState } from "react";
import { ImageUp, PencilLine, Trash2 } from "lucide-react";
import { NavigationItem } from "../src/components/ui/navigation-item";
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
import { Skeleton } from "../src/components/ui/skeleton";
import { Inline, Stack } from "../src/components/ui/layout";
import "./memory-settings.css";

// 대표 화면 4번 기억·설정입니다. 하늘 명세의 세 가지(기억, 채팅 시작 배경, 나에 대해)만 담습니다.
// 왼쪽 설정 목록 + 오른쪽 묶음 상자(제목·설명·오른쪽 조작)입니다.
// 화면 배치는 memory-settings.css에 토큰으로만 적습니다.

type Memory = { id: string; summary: string; date: string };

const shortMemories: Memory[] = [
  {
    id: "m1",
    summary: "고양이 두 마리(보리, 쌀)와 함께 살고, 주말마다 공원을 걷는다",
    date: "10월 24일",
  },
  {
    id: "m2",
    summary: "짧고 존댓말로, 결론을 먼저 말해 주기를 바란다",
    date: "10월 20일",
  },
  {
    id: "m3",
    summary: "React와 TypeScript로 개인 프로젝트를 만든다",
    date: "10월 12일",
  },
  {
    id: "m4",
    summary: "갤럭시 Z 폴드와 맥북을 함께 쓴다",
    date: "10월 11일",
  },
];

// 긴 한국어 조건: 띄어쓰기 없는 긴 단어와 여러 줄 문장을 함께 확인합니다.
const longMemories: Memory[] = shortMemories.map((memory, index) => ({
  ...memory,
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
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mst-row">
      <div className="mst-row-copy">
        <strong>{title}</strong>
        {description && <p>{description}</p>}
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
  const [memories, setMemories] = useState(() =>
    state === "empty" ? [] : longText ? longMemories : shortMemories,
  );
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
          아직 기억한 내용이 없습니다. 대화 중에 “이걸 기억해 줘”라고 말하면
          여기에 쌓입니다.
        </p>
      </div>
    );
  } else {
    body = (
      <ul className="mst-memories">
        {memories.map((memory, index) => (
          <li className="mst-memory" key={memory.id}>
            <div className="mst-memory-copy">
              <p>{memory.summary}</p>
              <time>{memory.date}</time>
            </div>
            <span className="mst-memory-actions">
              <IconButton
                icon={<PencilLine />}
                size="sm"
                variant="utility"
                aria-label={`기억 ${index + 1} 고치기`}
                onClick={() => setEditing(memory)}
              />
              <IconButton
                icon={<Trash2 />}
                size="sm"
                variant="utility"
                aria-label={`기억 ${index + 1} 지우기`}
                onClick={() => setDeleting(memory)}
              />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Stack gap={48}>
      <div className="mst-group">
        <div className="mst-rows">
          <Row
            title="기억 사용"
            description="대화에서 알게 된 내용을 다음 대화에서도 이어서 씁니다."
          >
            <SettingSwitch
              ref={toggle}
              label="기억 사용"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
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
      </div>

      <section className="mst-group" aria-labelledby="mst-topics-group">
        <h2 className="mst-group-title" id="mst-topics-group">
          기억한 내용 {memories.length > 0 && `${memories.length}개`}
        </h2>
        <div className="mst-rows">{body}</div>
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
  const [fade, setFade] = useState(true);
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
      <div className="mst-group">
        {/* Wallpaper 컴포넌트(6단계)가 없어 미리보기를 화면에서 만듭니다(2차 2-M14). */}
        <div
          className="mst-wall"
          aria-label="채팅 시작 화면 미리보기"
          role="img"
        >
          <img
            src={src}
            alt=""
            data-fade={fade}
            // 흐림을 주면 가장자리가 비치므로 조금 키워 덮습니다.
            style={{
              filter: `blur(${blur}px)`,
              opacity: opacity / 100,
              scale: blur ? "1.08" : undefined,
            }}
          />
          <p className="mst-wall-greeting">오늘은 어떤 이야기를 할까요?</p>
          <span className="mst-wall-composer" />
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
            description="이미지·GIF·MP4 파일을 20MB까지 올릴 수 있습니다."
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
            title="아래로 흐려지게"
            description="입력창 쪽으로 갈수록 배경이 바탕색으로 사라져 글자가 잘 보입니다."
          >
            <SettingSwitch
              label="아래로 흐려지게"
              checked={fade}
              onCheckedChange={setFade}
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
      </div>
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
    <Stack gap={48}>
      <div className="mst-group">
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
              <Field.Label>하늘이 부를 이름</Field.Label>
              <Field.Control defaultValue="바보리보" required maxLength={20} />
              <Field.Description>20자까지 쓸 수 있습니다.</Field.Description>
              <Field.Error match="valueMissing">이름을 입력하세요.</Field.Error>
              <Field.Error />
            </Field.Root>
            <Select
              label="기본 말투"
              name="tone"
              options={tones}
              defaultValue="friendly"
            />
            <Field.Root name="about">
              <Field.Label>하늘에게 알려 줄 내 소개</Field.Label>
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
      </div>
    </Stack>
  );
}

const sections = [
  {
    value: "memory",
    label: "기억",
    note: "하늘이 나에 대해 무엇을 기억할지 정합니다.",
  },
  {
    value: "wallpaper",
    label: "채팅 배경",
    note: "채팅 시작 화면 뒤에 깔리는 배경을 정합니다.",
  },
  {
    value: "profile",
    label: "나에 대해",
    note: "하늘이 나를 부르는 이름과 말투를 정합니다.",
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
  const current = sections.find((item) => item.value === section);
  return (
    <Toast.Provider>
      <div className="mst" key={`${state}-${longText}-${tab}`}>
        <div className="mst-nav">
          <p className="mst-nav-title">설정</p>
          <nav aria-label="설정 항목">
            <ul>
              {sections.map((item) => (
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
