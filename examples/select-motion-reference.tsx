"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { Badge } from "../src/components/ui/badge";
import { Icon } from "../src/components/ui/icon";

const teamChoices = ["디자인", "개발", "운영"];
const shortChoices = ["전체 공개", "친구만", "비공개"];
const longChoices = [
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
];

/** 문서에서 모양과 모션을 의논하기 위한 시안입니다. Select 구현과 분리합니다. */
export function SelectMotionReferenceExample() {
  const id = useId();
  const [many, setMany] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [placement, setPlacement] = useState({ side: "down", height: 240 });
  const [triggerHeight, setTriggerHeight] = useState(48);
  const stageRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const choices = many ? longChoices : multiple ? teamChoices : shortChoices;
  const fieldLabel = many ? "프로젝트" : multiple ? "분야" : "공개 범위";
  const scrollRef = useRef<HTMLDivElement>(null);
  // 각 끝에서 한 항목 정도(48px) 안에 들어오면 표시와 점유 영역을 줄입니다.
  const edgeRange = 48;
  const [edges, setEdges] = useState({ up: 0, down: 0 });
  function measureEdges() {
    const node = scrollRef.current;
    if (!node) return;
    // 표시 영역의 높이는 scrollHeight에 영향을 주지 않아 경계에서 재등장하지 않습니다.
    const max = Math.max(0, node.scrollHeight - node.clientHeight);
    const position = Math.max(0, Math.min(max, node.scrollTop));
    const strength = (distance: number) => {
      if (distance <= 0.5) return 0;
      const progress = Math.min(1, distance / edgeRange);
      return progress * progress * (3 - 2 * progress);
    };
    const up = max > 1 ? strength(position) : 0;
    const down = max > 1 ? strength(max - position) : 0;
    setEdges((previous) =>
      previous.up === up && previous.down === down ? previous : { up, down },
    );
  }
  function scrollList(direction: number) {
    const node = scrollRef.current;
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollBy({
      top: direction * node.clientHeight * 0.65,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  const triggerRef = useRef<HTMLButtonElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"shape" | "motion">("shape");
  const [slow, setSlow] = useState(false);
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(choices[0]);
  const [values, setValues] = useState<string[]>([choices[0]]);
  const visibleValues = values.slice(0, 2);
  const extraCount = Math.max(0, values.length - 2);
  const summary = multiple
    ? values.length === 0
      ? "선택하세요"
      : `${visibleValues.join(", ")}${extraCount ? ` 외 ${extraCount}개` : ""}`
    : value;
  // 닫히는 도중 목록의 내용이 바뀌지 않도록, 열 때 선택지를 확정합니다.
  const [options, setOptions] = useState(choices.slice(1));

  // 긴 선택값이 줄바꿈되면 버튼 높이도 배치 계산에 반영합니다.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const measure = () =>
      setTriggerHeight(Math.max(48, trigger.offsetHeight + 2));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  function changeList(next: boolean, nextMultiple = multiple) {
    const items = next
      ? longChoices
      : nextMultiple
        ? teamChoices
        : shortChoices;
    setMany(next);
    setMultiple(nextMultiple);
    setValue(items[0]);
    setValues([items[0]]);
    setOptions(nextMultiple ? items : items.slice(1));
    setOpen(true);
  }

  // 예제 영역과 실제 화면을 모두 고려합니다. 한쪽도 충분하지 않으면 더 넓은 쪽에 맞춥니다.
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const anchor = anchorRef.current;
      const stage = stageRef.current;
      const content = scrollRef.current?.firstElementChild;
      if (!anchor || !stage || !content) return;
      const rect = anchor.getBoundingClientRect();
      const boundary = stage.getBoundingClientRect();
      const viewport = window.visualViewport;
      const top = Math.max(boundary.top + 8, (viewport?.offsetTop ?? 0) + 8);
      const bottom = Math.min(
        boundary.bottom - 8,
        (viewport?.offsetTop ?? 0) +
          (viewport?.height ?? window.innerHeight) -
          8,
      );
      const above = Math.max(0, rect.top - top - 1);
      const below = Math.max(0, bottom - rect.bottom - 1);
      const desired = Math.min(240, content.scrollHeight + 16);
      const side = below >= desired || below >= above ? "down" : "up";
      const height = Math.min(240, Math.floor(side === "down" ? below : above));
      setPlacement((previous) =>
        previous.side === side && previous.height === height
          ? previous
          : { side, height },
      );
    }
    place();
    const observer = new ResizeObserver(place);
    for (const node of [
      stageRef.current,
      anchorRef.current,
      scrollRef.current?.firstElementChild,
    ])
      if (node) observer.observe(node);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.visualViewport?.removeEventListener("resize", place);
      window.visualViewport?.removeEventListener("scroll", place);
    };
  }, [open, options, atBottom]);

  function revealOption(option: HTMLButtonElement) {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const item = option.getBoundingClientRect();
    const viewport = scroll.getBoundingClientRect();
    // 페이드가 완전히 펼쳐져 있어도 포커스 항목이 가려지지 않게 여유를 둡니다.
    const margin = Math.min(
      32,
      Math.max(0, (viewport.height - item.height) / 2),
    );
    if (item.top < viewport.top + margin)
      scroll.scrollTop += item.top - viewport.top - margin;
    else if (item.bottom > viewport.bottom - margin)
      scroll.scrollTop += item.bottom - viewport.bottom + margin;
  }
  function focusOption(index: number) {
    const items = scrollRef.current?.querySelectorAll<HTMLButtonElement>(
      ".select-study-option",
    );
    if (!items?.length) return;
    const option = items[Math.max(0, Math.min(items.length - 1, index))];
    option.focus({ preventScroll: true });
    revealOption(option);
  }
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (!open) {
      pendingFocus.current =
        event.key === "ArrowUp" || event.key === "End" ? "last" : "first";
      show();
      return;
    }
    const items = Array.from(
      scrollRef.current?.querySelectorAll<HTMLButtonElement>(
        ".select-study-option",
      ) ?? [],
    );
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : index < 0
            ? event.key === "ArrowUp"
              ? items.length - 1
              : 0
            : index + (event.key === "ArrowDown" ? 1 : -1);
    focusOption(next);
  }
  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node || !open) return;
    node.scrollTop = 0;
    measureEdges();
    if (pendingFocus.current) {
      focusOption(pendingFocus.current === "last" ? options.length - 1 : 0);
      pendingFocus.current = null;
    }
    const observer = new ResizeObserver(measureEdges);
    observer.observe(node);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    return () => observer.disconnect();
  }, [open, options]);

  function show() {
    setOptions(
      multiple ? choices : choices.filter((choice) => choice !== value),
    );
    setOpen(true);
  }
  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }
  useEffect(() => {
    if (!open || mode === "shape") return;
    function dismiss(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !surfaceRef.current?.contains(target) &&
        !controlsRef.current?.contains(target)
      )
        setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open, mode]);

  return (
    <section
      className="select-study"
      data-mode={mode}
      data-slow={slow ? "" : undefined}
      aria-label="Select 모션 시안"
    >
      <style>{studyStyles}</style>
      <div ref={controlsRef} className="select-study-controls">
        <div
          className="select-study-modes"
          role="group"
          aria-label="시안 보기 방식"
        >
          <button
            type="button"
            aria-pressed={mode === "shape"}
            onClick={() => {
              setMode("shape");
              show();
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
        <div className="select-study-modes" role="group" aria-label="목록 길이">
          <button
            type="button"
            aria-pressed={!many}
            onClick={() => changeList(false)}
          >
            적은 목록 · 3개
          </button>
          <button
            type="button"
            aria-pressed={many}
            onClick={() => changeList(true)}
          >
            많은 목록 · 16개
          </button>
        </div>
        <div className="select-study-modes" role="group" aria-label="선택 방식">
          <button
            type="button"
            aria-pressed={!multiple}
            onClick={() => changeList(many, false)}
          >
            단일 선택
          </button>
          <button
            type="button"
            aria-pressed={multiple}
            onClick={() => changeList(many, true)}
          >
            다중 선택
          </button>
        </div>
        <div className="select-study-modes" role="group" aria-label="버튼 위치">
          <button
            type="button"
            aria-pressed={!atBottom}
            onClick={() => setAtBottom(false)}
          >
            기본 위치
          </button>
          <button
            type="button"
            aria-pressed={atBottom}
            onClick={() => setAtBottom(true)}
          >
            아래쪽에 놓기
          </button>
        </div>
        <label className="select-study-slow">
          <input
            type="checkbox"
            checked={slow}
            onChange={(event) => setSlow(event.target.checked)}
          />{" "}
          4배 느리게 보기
        </label>
      </div>
      <p className="select-study-hint">
        {mode === "shape"
          ? "버튼과 목록이 맞닿는 모서리와 구분선을 확인해보세요."
          : `${fieldLabel} 버튼을 눌러 펼치거나 접고, 다른 값을 선택해보세요.`}
      </p>
      <div
        ref={stageRef}
        className="select-study-stage"
        data-bottom={atBottom ? "" : undefined}
        style={
          { "--study-trigger-height": `${triggerHeight}px` } as CSSProperties
        }
      >
        <span id={`${id}-label`}>{fieldLabel}</span>
        <div ref={anchorRef} className="select-study-anchor">
          <div
            ref={surfaceRef}
            className="select-study-surface"
            data-open={open ? "" : undefined}
            data-side={placement.side}
            style={
              {
                "--study-list-height": `${placement.height}px`,
              } as CSSProperties
            }
            onKeyDown={navigate}
            onBlur={(event) => {
              if (
                mode === "motion" &&
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                ) &&
                !controlsRef.current?.contains(
                  event.relatedTarget as Node | null,
                )
              )
                setOpen(false);
            }}
          >
            <button
              ref={triggerRef}
              type="button"
              className="select-study-trigger"
              data-multiple={multiple ? "" : undefined}
              aria-labelledby={`${id}-label ${id}-value`}
              aria-expanded={open}
              aria-controls={`${id}-options`}
              onClick={() => (open ? close() : show())}
            >
              {multiple ? (
                <span
                  id={`${id}-value`}
                  className="select-study-summary"
                  aria-label={summary}
                >
                  <span className="select-study-names">
                    {visibleValues.length ? (
                      visibleValues.map((name, index) => (
                        <span key={name} className="select-study-summary-entry">
                          <span className="select-study-name" title={name}>
                            {name}
                          </span>
                          {index < visibleValues.length - 1 && <span>,</span>}
                        </span>
                      ))
                    ) : (
                      <span className="select-study-name">선택하세요</span>
                    )}
                  </span>
                  {extraCount > 0 && (
                    <Badge
                      size="sm"
                      variant="standard"
                      className="select-study-count"
                    >
                      외 {extraCount}개
                    </Badge>
                  )}
                </span>
              ) : (
                <span id={`${id}-value`}>{summary}</span>
              )}
              <span className="select-study-chevron">
                <Icon name="icon-regular-chevron-large-down" size={16} />
              </span>
            </button>
            <div
              className="select-study-reveal"
              inert={!open}
              aria-hidden={!open}
            >
              <div className="select-study-clip">
                <div
                  className="select-study-list"
                  style={
                    {
                      "--study-edge-up": edges.up,
                      "--study-edge-down": edges.down,
                    } as CSSProperties
                  }
                >
                  <div
                    ref={scrollRef}
                    className="select-study-scroll"
                    id={`${id}-options`}
                    role="group"
                    aria-label={`${multiple ? "선택할" : "다른"} ${fieldLabel}`}
                    tabIndex={-1}
                    onScroll={measureEdges}
                  >
                    <div className="select-study-options">
                      {options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className="select-study-option"
                          aria-pressed={
                            multiple ? values.includes(option) : undefined
                          }
                          onFocus={(event) => {
                            if (event.currentTarget.matches(":focus-visible"))
                              revealOption(event.currentTarget);
                          }}
                          onClick={() => {
                            if (multiple) {
                              setValues((current) =>
                                current.includes(option)
                                  ? current.filter((item) => item !== option)
                                  : [...current, option],
                              );
                            } else {
                              setValue(option);
                              close();
                            }
                          }}
                        >
                          <span>{option}</span>
                          {multiple && (
                            <span className="select-study-check">
                              {values.includes(option) && (
                                <Icon name="icon-filled-check" size={20} />
                              )}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="select-study-edge"
                    data-side="up"
                    aria-hidden={edges.up === 0}
                    disabled={edges.up === 0}
                    aria-label="목록 위로 스크롤"
                    onClick={() => scrollList(-1)}
                  >
                    <Icon name="icon-regular-chevron-large-up" size={16} />
                  </button>
                  <button
                    type="button"
                    className="select-study-edge"
                    data-side="down"
                    aria-hidden={edges.down === 0}
                    disabled={edges.down === 0}
                    aria-label="목록 아래로 스크롤"
                    onClick={() => scrollList(1)}
                  >
                    <Icon name="icon-regular-chevron-large-down" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <label className="select-study-underlay">
          프로젝트 이름
          <input readOnly value="새 프로젝트" />
        </label>
      </div>
      {multiple && (
        <p className="select-study-selection" role="status">
          선택한 항목: {values.join(", ") || "없음"}
        </p>
      )}
      <p className="select-study-note">
        모션 시안 · 실제 Select에 적용하기 전 형태를 확인하는 예제입니다.
      </p>
    </section>
  );
}

// 시안 전용 스타일. 모션 토큰을 바꾸면 기본 속도와 곡선도 함께 따라갑니다.
const studyStyles = `
.select-study { --study-speed: 1; --study-open: calc(var(--rbx-motion-duration-panel) * var(--study-speed)); --study-close: calc(var(--rbx-motion-duration-panel-exit) * var(--study-speed)); --study-follow: calc(var(--rbx-time-100) * var(--study-speed)); width:100%; max-width:560px; margin-inline:auto; }
.select-study[data-slow] { --study-speed:4; }
.select-study-controls, .select-study-modes { display:flex; flex-wrap:wrap; align-items:center; gap:8px; }
.select-study-controls { justify-content:space-between; gap:16px; }
.select-study-modes button { padding:8px 12px; border:1px solid var(--rbx-color-stroke-default); border-radius:8px; background:transparent; color:inherit; cursor:pointer; }
.select-study-modes button[aria-pressed="true"] { background:var(--rbx-color-action-standard-background); }
.select-study-slow { display:flex; align-items:center; gap:6px; font-size:13px; }
.select-study-hint, .select-study-note { color:var(--rbx-color-content-default); font-size:13px; margin:16px 0; }
.select-study-stage { position:relative; box-sizing:border-box; max-width:336px; margin:32px auto 0; height:400px; padding:8px; }
.select-study-stage[data-bottom] > span { position:absolute; bottom:calc(var(--study-trigger-height,48px) + 16px); }
.select-study-stage[data-bottom] .select-study-anchor { position:absolute; inset-inline:8px; bottom:8px; margin-top:0; }
.select-study-stage[data-bottom] .select-study-underlay { display:none; }
.select-study-selection { font-size:13px; overflow-wrap:anywhere; }
.select-study-anchor { position:relative; height:var(--study-trigger-height,48px); margin-top:8px; }
/* 연결 부위에는 그림자를 만들지 않고, 전체 표면 아래로 그림자를 드리웁니다. */
.select-study-surface { position:absolute; inset:0 0 auto; z-index:2; overflow:hidden; border:1px solid var(--rbx-color-stroke-contrast-alpha); border-radius:12px; background:var(--rbx-color-surface-100); box-shadow:none; transition:box-shadow var(--study-close) var(--rbx-motion-ease-exit); }
.select-study-surface[data-open] { box-shadow:var(--rbx-shadow-transient-low); transition-duration:var(--study-open); transition-timing-function:var(--rbx-motion-ease-enter); }
.select-study-surface[data-side="up"] { top:auto; bottom:0; display:flex; flex-direction:column-reverse; --study-list-offset:-12px; }
.select-study-surface[data-side="up"][data-open] .select-study-trigger { border-radius:0 0 11px 11px; }
.select-study-surface[data-side="up"] .select-study-clip::before { display:none; }
.select-study-surface[data-side="up"] .select-study-clip::after { content:""; display:block; height:1px; background:var(--rbx-color-stroke-default); }
.select-study-surface[data-side="up"] .select-study-chevron { rotate:180deg; }
.select-study-surface[data-side="up"][data-open] .select-study-chevron { rotate:0deg; }
.select-study-trigger { display:flex; align-items:center; justify-content:space-between; width:100%; min-height:46px; padding:10px 16px; border:0; border-radius:11px; color:inherit; background:transparent; text-align:start; cursor:pointer; transition:border-radius var(--study-follow) var(--rbx-motion-ease-exit) var(--study-close); }
.select-study-surface[data-open] .select-study-trigger { border-bottom-left-radius:0; border-bottom-right-radius:0; transition-delay:0ms; }
.select-study-trigger[data-multiple] { height:46px; gap:12px; }
.select-study-summary { display:flex; align-items:center; gap:8px; flex:1; min-width:0; }
.select-study-names { display:flex; align-items:center; gap:4px; flex:1; min-width:0; }
.select-study-summary-entry { display:flex; gap:0; flex:0 1 auto; min-width:0; }
.select-study-name { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.select-study-summary-entry > span:last-child:not(.select-study-name), .select-study-count { flex-shrink:0; }
.select-study-chevron { display:flex; flex-shrink:0; transition:rotate var(--study-open) var(--rbx-motion-ease-enter); }
.select-study-surface[data-open] .select-study-chevron { rotate:180deg; }
/* 배경의 높이만 바꾸고 글자는 늘이지 않습니다. */
.select-study-reveal { display:grid; grid-template-rows:0fr; transition:grid-template-rows var(--study-close) var(--rbx-motion-ease-exit); }
.select-study-surface[data-open] .select-study-reveal { grid-template-rows:1fr; transition-duration:var(--study-open); transition-timing-function:var(--rbx-motion-ease-enter); }
.select-study-clip { min-height:0; overflow:hidden; }
.select-study-list { position:relative; opacity:0; transform:translateY(var(--study-list-offset,12px)); transition:opacity var(--study-close) var(--rbx-motion-ease-exit), transform var(--study-close) var(--rbx-motion-ease-exit); }
.select-study-clip::before { content:""; display:block; height:1px; background:var(--rbx-color-stroke-default); }
.select-study-surface[data-open] .select-study-list { opacity:1; transform:translateY(0); transition-duration:var(--study-open); transition-timing-function:var(--rbx-motion-ease-enter); transition-delay:var(--study-follow); }
/* 화살표와 페이드는 스크롤 영역 위에 고정하고, 선택값과 구분선은 움직이지 않습니다. */
.select-study-scroll { box-sizing:border-box; max-height:var(--study-list-height,240px); overflow-y:auto; touch-action:pan-y; overscroll-behavior:contain; scrollbar-width:none; padding:8px; scroll-padding-block:32px; }
.select-study-scroll::-webkit-scrollbar { display:none; }
/* 스크롤 범위는 고정하고 화살표가 덮는 표시 영역만 줄입니다. */
.select-study-edge { position:absolute; z-index:1; inset-inline:0; height:calc(28px * var(--study-edge-strength)); opacity:var(--study-edge-strength); overflow:hidden; display:flex; align-items:center; justify-content:center; border:0; padding:0; color:var(--rbx-color-content-emphasis); cursor:pointer; transition:height var(--study-follow) var(--rbx-motion-ease-enter), opacity var(--study-follow) var(--rbx-motion-ease-enter); }
.select-study-edge:disabled { pointer-events:none; }
.select-study-edge > .rbx-icon { flex-shrink:0; }
.select-study-edge[data-side="up"] { --study-edge-strength:var(--study-edge-up,0); top:0; background:linear-gradient(to bottom,var(--rbx-color-surface-100) 45%,transparent); }
.select-study-edge[data-side="down"] { --study-edge-strength:var(--study-edge-down,0); bottom:0; background:linear-gradient(to top,var(--rbx-color-surface-100) 45%,transparent); }
.select-study-option { display:flex; align-items:center; gap:12px; width:100%; padding:12px 8px; border:0; border-radius:6px; background:transparent; color:inherit; text-align:start; white-space:normal; overflow-wrap:anywhere; cursor:pointer; }
.select-study-option > span:first-child { min-width:0; flex:1; }
.select-study-check { width:20px; height:20px; display:flex; flex-shrink:0; margin-inline-start:auto; }
.select-study-option:hover { background:var(--rbx-color-state-hover); }
.select-study :is(button,input):focus-visible { outline:2px solid var(--rbx-focus-ring); outline-offset:-3px; }
.select-study-underlay { display:grid; gap:8px; margin-top:24px; }
.select-study-underlay input { box-sizing:border-box; width:100%; height:48px; padding:12px 16px; border:1px solid var(--rbx-color-stroke-contrast-alpha); border-radius:8px; background:transparent; color:var(--rbx-color-content-default); }
.select-study[data-mode="shape"] *:not(.select-study-edge), .select-study[data-mode="shape"] *::before { transition:none; }
@media (prefers-reduced-motion:reduce) { .select-study *, .select-study *::before { transition:none !important; } }
`;
