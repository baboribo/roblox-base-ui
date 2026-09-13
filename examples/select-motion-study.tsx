"use client";

import { useId, useState } from "react";
import { Select, type SelectOption } from "../src/components/ui/select";
import { Dialog } from "../src/components/ui/dialog";

const projects: SelectOption[] = [
  "홈 화면",
  "프로젝트 관리",
  "에셋 라이브러리",
  "팀 대시보드",
  "사용자 설정",
  "알림 센터",
  "파일 탐색기",
  "작업 기록",
  "댓글 패널",
  "공유 설정",
  "검색 화면",
  "템플릿 목록",
  "미디어 뷰어",
  "팀 구성원만 열람할 수 있는 프로젝트",
  "도움말",
  "보관함",
].map((label, index) => ({
  label,
  value: `project-${index}`,
  disabled: index === 15,
}));
const visibility = [
  { label: "전체 공개", value: "public" },
  { label: "친구만", value: "friends" },
  { label: "비공개", value: "private" },
];
const teams = [
  { label: "디자인", value: "design" },
  { label: "개발", value: "development" },
  { label: "운영", value: "operations" },
];

export function SelectMotionStudyExample() {
  const formId = useId();
  const controlId = useId();
  const [many, setMany] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [size, setSize] = useState<"sm" | "md" | "lg">("lg");
  const [atBottom, setAtBottom] = useState(false);
  const [mode, setMode] = useState<"shape" | "motion">("shape");
  const [slow, setSlow] = useState(false);
  const [open, setOpen] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [environment, setEnvironment] = useState<
    "normal" | "scroll" | "dialog"
  >("normal");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | string[] | null>("public");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState("");
  const options = many ? projects : multiple ? teams : visibility;
  const label = many ? "프로젝트" : multiple ? "분야" : "공개 범위";
  const empty = value === null || (Array.isArray(value) && value.length === 0);
  const error =
    submitted && empty && !disabled ? `${label}를 선택하세요.` : undefined;
  function resetCase(nextMany = many, nextMultiple = multiple) {
    const items = nextMany ? projects : nextMultiple ? teams : visibility;
    setMany(nextMany);
    setMultiple(nextMultiple);
    setValue(nextMultiple ? [items[0].value] : items[0].value);
    setSubmitted(false);
    setResult("");
    setOpen(!disabled);
  }
  const editor = (
    <div>
      <div
        ref={setBoundary}
        className="study-stage"
        data-bottom={atBottom ? "" : undefined}
      >
        <div className="study-field-place">
          <Select<boolean>
            key={`${many}-${multiple}`}
            id={controlId}
            form={formId}
            name="choice"
            required
            label={label}
            options={options}
            multiple={multiple}
            value={value}
            onValueChange={setValue}
            open={open}
            onOpenChange={setOpen}
            size={size}
            disabled={disabled}
            readOnly={readOnly}
            error={error}
            description={
              many
                ? "보관함은 선택할 수 없는 항목입니다."
                : "목록에서 값을 선택하세요."
            }
            collisionBoundary={
              environment === "normal" ? (boundary ?? undefined) : undefined
            }
            motionScale={mode === "shape" ? 0 : slow ? 4 : 1}
          />
        </div>
        <div className="study-background" aria-hidden="true">
          다음 입력 영역
        </div>
      </div>
      <form
        id={formId}
        className="study-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          if (empty && !disabled) {
            document.getElementById(controlId)?.focus();
            setResult("");
            return;
          }
          setResult(
            JSON.stringify(new FormData(event.currentTarget).getAll("choice")),
          );
        }}
        onReset={() => {
          setValue(multiple ? [options[0].value] : options[0].value);
          setSubmitted(false);
          setResult("");
          setOpen(false);
        }}
      >
        <button type="submit">폼 제출</button>
        <button type="reset">초기화</button>
        <button
          type="button"
          onClick={() => {
            setValue(multiple ? [] : null);
            setOpen(false);
          }}
        >
          선택 비우기
        </button>
        <button
          type="button"
          onClick={() => {
            const next = options[1].value;
            setValue(multiple ? [next] : next);
          }}
        >
          외부에서 두 번째 값 지정
        </button>
        {result && <output aria-label="폼 제출 결과">{result}</output>}
      </form>
    </div>
  );

  return (
    <section className="study" aria-label="Select 동작 비교">
      <style>{studyStyles}</style>
      <div className="study-controls">
        <div role="group" aria-label="시안 보기 방식">
          <button
            type="button"
            aria-pressed={mode === "shape"}
            onClick={() => {
              setMode("shape");
              setOpen(true);
            }}
          >
            열린 모양
          </button>
          <button
            type="button"
            aria-pressed={mode === "motion"}
            onClick={() => {
              setMode("motion");
              setOpen(false);
            }}
          >
            모션 보기
          </button>
        </div>
        <div role="group" aria-label="목록 길이">
          <button
            type="button"
            aria-pressed={!many}
            onClick={() => resetCase(false)}
          >
            적은 목록 · 3개
          </button>
          <button
            type="button"
            aria-pressed={many}
            onClick={() => resetCase(true)}
          >
            많은 목록 · 16개
          </button>
        </div>
        <div role="group" aria-label="선택 방식">
          <button
            type="button"
            aria-pressed={!multiple}
            onClick={() => resetCase(many, false)}
          >
            단일 선택
          </button>
          <button
            type="button"
            aria-pressed={multiple}
            onClick={() => resetCase(many, true)}
          >
            다중 선택
          </button>
        </div>
        <div role="group" aria-label="크기">
          {(["sm", "md", "lg"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={size === item}
              onClick={() => {
                setSize(item);
                setOpen(true);
              }}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <div role="group" aria-label="버튼 위치">
          <button
            type="button"
            aria-pressed={!atBottom}
            onClick={() => {
              setAtBottom(false);
              setOpen(true);
            }}
          >
            기본 위치
          </button>
          <button
            type="button"
            aria-pressed={atBottom}
            onClick={() => {
              setAtBottom(true);
              setOpen(true);
            }}
          >
            아래쪽에 놓기
          </button>
        </div>
        <div role="group" aria-label="사용 환경">
          {(
            [
              ["normal", "기본 화면"],
              ["scroll", "스크롤 영역"],
              ["dialog", "다이얼로그 안"],
            ] as const
          ).map(([next, text]) => (
            <button
              key={next}
              type="button"
              aria-pressed={environment === next}
              onClick={() => {
                setEnvironment(next);
                setOpen(false);
                if (next === "dialog") setDialogOpen(true);
              }}
            >
              {text}
            </button>
          ))}
        </div>
        <label>
          <input
            type="checkbox"
            checked={slow}
            onChange={(event) => setSlow(event.target.checked)}
          />
          4배 느리게 보기
        </label>
        <label>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(event) => {
              setDisabled(event.target.checked);
              setOpen(false);
            }}
          />
          비활성
        </label>
        <label>
          <input
            type="checkbox"
            checked={readOnly}
            onChange={(event) => setReadOnly(event.target.checked)}
          />
          읽기 전용
        </label>
      </div>
      <p className="study-note">
        선택 비우기 후 폼을 제출하면 오류 상태를 확인할 수 있습니다. 제출
        결과에는 표시 이름이 아닌 실제 값이 나옵니다.
      </p>
      {environment === "dialog" ? (
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger>다이얼로그 열기</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
              <Dialog.Title>프로젝트 설정</Dialog.Title>
              <Dialog.Description>
                다이얼로그 안에서 선택과 폼 제출을 확인합니다.
              </Dialog.Description>
              <Dialog.Body>{editor}</Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>설정 닫기</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      ) : environment === "scroll" ? (
        <div
          className="study-scroll-host"
          role="region"
          aria-label="스크롤 테스트 영역"
          tabIndex={0}
        >
          <p>이 영역을 위아래로 스크롤해보세요.</p>
          {editor}
          <div style={{ height: 220 }} />
        </div>
      ) : (
        editor
      )}
      <p className="study-note">
        정식 Select와 같은 컴포넌트입니다. 크기와 선택 방식에 따른 동작을
        비교합니다.
      </p>
    </section>
  );
}

const studyStyles = `
.study { width:100%; max-width:660px; margin-inline:auto; }
.study-controls { display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
.study-controls > div, .study-form { display:flex; gap:6px; flex-wrap:wrap; }
.study-controls button, .study-form button { padding:8px 12px; border:1px solid var(--rbx-color-stroke-default); border-radius:8px; color:inherit; background:transparent; cursor:pointer; }
.study-controls button[aria-pressed="true"] { background:var(--rbx-color-action-standard-background); }
.study-controls label { display:flex; align-items:center; gap:6px; font-size:13px; }
.study :is(button,input):focus-visible { outline:2px solid var(--rbx-focus-ring); outline-offset:2px; }
.study-note { font-size:13px; color:var(--rbx-color-content-default); }
.study-stage { position:relative; box-sizing:border-box; height:400px; max-width:336px; margin:24px auto; padding:8px; }
.study-field-place { position:absolute; inset:8px 8px auto; }
.study-stage[data-bottom] .study-field-place { inset:auto 8px 8px; }
.study-background { margin-top:112px; border:1px solid var(--rbx-color-stroke-default); border-radius:8px; padding:12px; color:var(--rbx-color-content-default); }
.study-form output { flex-basis:100%; overflow-wrap:anywhere; margin-top:8px; }
.study-scroll-host { height:300px; overflow:auto; border:1px solid var(--rbx-color-stroke-default); border-radius:12px; padding:16px; }
`;
