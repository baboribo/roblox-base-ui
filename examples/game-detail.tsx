"use client";
import { useRef, useState } from "react";
import {
  ArrowRight,
  BookmarkCheck,
  BookmarkPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flag,
  Globe,
  Mail,
  MonitorSmartphone,
  MoreVertical,
  Play,
  Share2,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Avatar } from "../src/components/ui/avatar";
import { Menu } from "../src/components/ui/menu";
import { Dialog } from "../src/components/ui/dialog";
import { Toggle } from "../src/components/ui/toggle";
import { Collapsible } from "../src/components/ui/collapsible";
import { Radio } from "../src/components/ui/radio";
import { RadioGroup } from "../src/components/ui/radio-group";
import { Field } from "../src/components/ui/field";
import { Textarea } from "../src/components/ui/textarea";
import { Toast } from "../src/components/ui/toast";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { Inline, Stack } from "../src/components/ui/layout";
import "./game-detail.css";

// 대표 화면 6번 게임 상세입니다. 구글 플레이 게임 상세(2026년 10월)의 정보 구성을 따르고,
// 평가는 Roblox처럼 추천/비추천 비율로 바꿨습니다. 화면 배치는 game-detail.css에 토큰으로만 적습니다.
// 라이브러리에 없어 화면에서 만든 부분은 docs/engineering/COMPOSITION-REVIEW.md에 기록합니다.

/** 예제용 게임 그림입니다. 하늘·섬·캐릭터를 그리고, 스크린샷에는 홍보 문구를 얹습니다. */
function art(
  hue: number,
  {
    ratio = "wide",
    caption,
  }: { ratio?: "wide" | "square"; caption?: string } = {},
) {
  const [w, h] = ratio === "square" ? [240, 240] : [640, 360];
  const ground = h * 0.72;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${hue} 70% 62%)"/><stop offset="1" stop-color="hsl(${hue + 35} 85% 86%)"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#s)"/>
<circle cx="${w * 0.78}" cy="${h * 0.24}" r="${h * 0.11}" fill="hsl(${hue + 60} 100% 92%)"/>
<g fill="white" opacity=".75"><ellipse cx="${w * 0.2}" cy="${h * 0.2}" rx="${w * 0.1}" ry="${h * 0.045}"/><ellipse cx="${w * 0.52}" cy="${h * 0.12}" rx="${w * 0.08}" ry="${h * 0.035}"/></g>
<path d="M${w * 0.48} ${h * 0.42}h${w * 0.2}l-${w * 0.04} ${h * 0.12}h-${w * 0.12}z" fill="hsl(${hue + 150} 30% 35%)"/>
<rect x="${w * 0.48}" y="${h * 0.39}" width="${w * 0.2}" height="${h * 0.04}" rx="4" fill="hsl(${hue + 120} 55% 48%)"/>
<path d="M0 ${ground}Q${w * 0.25} ${ground - h * 0.12} ${w * 0.5} ${ground}T${w} ${ground - h * 0.05}V${h}H0z" fill="hsl(${hue + 120} 45% 42%)"/>
<path d="M0 ${h * 0.86}Q${w * 0.4} ${h * 0.78} ${w} ${h * 0.88}V${h}H0z" fill="hsl(${hue + 120} 40% 32%)"/>
<g transform="translate(${w * 0.24} ${ground - h * 0.2})"><rect width="${h * 0.1}" height="${h * 0.1}" rx="3" fill="hsl(45 90% 70%)"/><rect y="${h * 0.1}" width="${h * 0.1}" height="${h * 0.12}" fill="hsl(${hue + 200} 60% 45%)"/></g>
${
  caption
    ? `<text x="${w / 2}" y="${h * 0.9}" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="${h * 0.1}" fill="white" stroke="hsl(${hue} 60% 25%)" stroke-width="${h * 0.02}" paint-order="stroke">${caption}</text>`
    : ""
}</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

type Review = {
  id: string;
  author: string;
  date: string;
  up: boolean;
  hours: number;
  text: string;
  helpful: number;
  reply?: { date: string; text: string };
};

const reviews: Review[] = [
  {
    id: "r1",
    author: "구름빵",
    date: "2026-10-25",
    up: true,
    hours: 42,
    text: "친구 셋이랑 배 만들어서 다음 섬까지 가는 게 제일 재밌어요. 섬마다 퍼즐이 달라서 질리지 않고, 이번에 생긴 하늘 고래 보스는 음악까지 멋있었습니다. 다만 보스 보상이 조금 적어서 여러 번 돌아야 하는 건 아쉬워요.",
    helpful: 128,
    reply: {
      date: "2026-10-26",
      text: "안녕하세요, 하늘공방입니다. 하늘 고래를 재미있게 즐겨 주셔서 감사합니다! 보상 의견은 다음 주 업데이트에서 반영할게요.",
    },
  },
  {
    id: "r2",
    author: "모험가토끼",
    date: "2026-10-22",
    up: true,
    hours: 9,
    text: "처음엔 조작이 좀 어려웠는데 튜토리얼 섬을 끝까지 하니 괜찮아요. 휴대폰으로도 잘 돌아갑니다.",
    helpful: 41,
  },
  {
    id: "r3",
    author: "밤하늘",
    date: "2026-10-18",
    up: false,
    hours: 3,
    text: "서버가 붐비는 저녁에는 섬을 옮길 때마다 끊겨요. 끊기면 모은 재료가 사라지는 경우도 있어서 아쉽습니다.",
    helpful: 19,
    reply: {
      date: "2026-10-20",
      text: "불편을 드려 죄송합니다. 10월 24일 업데이트에서 섬 이동 중 재료가 사라지는 문제를 고쳤습니다. 계속 생기면 게임 안 고객센터로 알려 주세요.",
    },
  },
  {
    id: "r4",
    author: "섬지기",
    date: "2026-10-24",
    up: true,
    hours: 120,
    text: "매주 금요일 새 섬 열리는 날만 기다립니다.",
    helpful: 12,
  },
  {
    id: "r5",
    author: "새싹",
    date: "2026-10-12",
    up: true,
    hours: 1,
    text: "처음 해 봤는데 길 찾기가 조금 헷갈렸어요. 그래도 그림이 예뻐요.",
    helpful: 3,
  },
];

const longReviews: Review[] = reviews.map((review, index) => ({
  ...review,
  author: index === 0 ? "아주아주긴닉네임을가진하늘섬탐험대장" : review.author,
  text:
    index % 2 === 0
      ? `${review.text} 그리고 다음 업데이트에서는 친구 초대 보상도 늘려 주시고, 섬 사이를 오가는 배를 꾸밀 수 있는 장식도 더 많이 넣어 주시면 정말 좋겠습니다. 오래오래 운영해 주세요!`
      : `${review.text.replaceAll(" ", "")}ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ`,
}));

const shots = [
  [205, "구름 위 섬을 탐험해요"],
  [25, "친구와 배를 만들어요"],
  [140, "섬마다 다른 퍼즐"],
  [290, "하늘 고래 보스 등장!"],
  [45, "매주 새 섬이 열려요"],
] as const;

const similar = [
  ["s1", "우주 정거장 생존기", "별빛 게임즈", 88, 250],
  ["s2", "고양이 마을", "냥냥 스튜디오", 93, 45],
  ["s3", "바다 낚시 대회", "파도소리", 90, 180],
  ["s4", "무지개 장애물", "점프점프", 86, 290],
  ["s5", "도시 건설왕", "블록 시티", 91, 140],
] as const;

const more = [
  ["m1", "하늘섬 레이싱", "하늘공방 스튜디오", 89, 220],
  ["m2", "구름 카페 타이쿤", "하늘공방 스튜디오", 92, 330],
  ["m3", "별똥별 사냥꾼", "하늘공방 스튜디오", 84, 260],
] as const;

const devices = ["휴대폰", "태블릿", "PC", "콘솔"];

const description = `구름 위에 떠 있는 수백 개의 섬, 그 끝에는 아무도 가 보지 못한 하늘 왕국이 있어요.
친구와 함께 배를 만들고, 섬마다 숨겨진 퍼즐을 풀며 다음 섬으로 떠나세요.

■ 매주 금요일 새 섬 오픈
새로운 섬마다 새로운 퍼즐과 재료가 기다려요.

■ 최대 12명이 함께하는 보스 레이드
하늘 고래, 번개 새, 구름 거인과 겨뤄 보세요.

■ 시즌 보상으로 받는 아바타 장식
시즌마다 바뀌는 날개·모자·배 장식을 모아 보세요.`;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function count(value: number) {
  return value.toLocaleString("ko-KR");
}

function MiniGame({
  id,
  title,
  creator,
  like,
  hue,
}: {
  id: string;
  title: string;
  creator: string;
  like: number;
  hue: number;
}) {
  return (
    <li className="gdt-mini">
      <img src={art(hue, { ratio: "square" })} alt="" />
      <div>
        <a href={`#game-${id}`}>{title}</a>
        <span className="gdt-mini-meta">{creator}</span>
        <span className="gdt-mini-meta">추천 {like}%</span>
      </div>
    </li>
  );
}

function ReviewItem({
  review,
  developer,
  onReport,
}: {
  review: Review;
  developer: string;
  onReport: () => void;
}) {
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);
  const total = review.helpful + (helpful === "yes" ? 1 : 0);
  return (
    <article className="gdt-review" aria-labelledby={`${review.id}-author`}>
      <div className="gdt-review-head">
        <Avatar.Root>
          <Avatar.Fallback>{review.author.slice(0, 1)}</Avatar.Fallback>
        </Avatar.Root>
        <h3 id={`${review.id}-author`} className="gdt-review-author">
          {review.author}
        </h3>
        <Menu.Root>
          <Menu.Trigger
            render={
              <IconButton
                icon={<MoreVertical />}
                size="sm"
                variant="utility"
                aria-label={`${review.author}님의 리뷰 더보기`}
              />
            }
          />
          <Menu.Portal>
            <Menu.Positioner sideOffset={4} align="end">
              <Menu.Popup size="sm">
                <Menu.Item onClick={onReport}>부적절한 리뷰로 신고</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
      <p className="gdt-review-meta">
        <span className="gdt-verdict" data-up={review.up}>
          {review.up ? (
            <ThumbsUp size={14} aria-hidden="true" />
          ) : (
            <ThumbsDown size={14} aria-hidden="true" />
          )}
          {review.up ? "추천" : "비추천"}
        </span>
        <span aria-hidden="true">·</span>
        <span>플레이 {review.hours}시간</span>
        <span aria-hidden="true">·</span>
        <time dateTime={review.date}>{formatDate(review.date)}</time>
      </p>
      <p className="gdt-review-text">{review.text}</p>
      <div className="gdt-helpful">
        {total > 0 && (
          <span>{count(total)}명이 이 리뷰가 유용하다고 했어요</span>
        )}
        <span className="gdt-helpful-row">
          <span id={`${review.id}-helpful`}>이 리뷰가 유용했나요?</span>
          <span
            className="gdt-helpful-buttons"
            role="group"
            aria-labelledby={`${review.id}-helpful`}
          >
            {(["yes", "no"] as const).map((value) => (
              <Toggle
                key={value}
                pressed={helpful === value}
                onPressedChange={(pressed) =>
                  setHelpful(pressed ? value : null)
                }
              >
                {value === "yes" ? "예" : "아니요"}
              </Toggle>
            ))}
          </span>
        </span>
      </div>
      {review.reply && (
        <div className="gdt-reply">
          <p className="gdt-reply-head">
            <span>{developer}의 답변</span>
            <time dateTime={review.reply.date}>
              {formatDate(review.reply.date)}
            </time>
          </p>
          <p>{review.reply.text}</p>
        </div>
      )}
    </article>
  );
}

export type GameDetailState = "default" | "loading" | "empty" | "error";

function Detail({
  state,
  longText,
}: {
  state: GameDetailState;
  longText: boolean;
}) {
  const toast = Toast.useToastManager();
  const [status, setStatus] = useState(state);
  const [wish, setWish] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [device, setDevice] = useState("휴대폰");
  const [about, setAbout] = useState(false);
  const [allReviews, setAllReviews] = useState(false);
  const [shot, setShot] = useState<number | null>(null);
  const [report, setReport] = useState(false);
  const [writing, setWriting] = useState(false);
  const shotsRef = useRef<HTMLUListElement>(null);
  const developer = "하늘공방 스튜디오";
  const title = longText
    ? "하늘섬 탐험: 끝없이 이어지는 구름 너머 비밀의 왕국을 찾아 떠나는 여름방학 대모험 시즌 2"
    : "하늘섬 탐험";
  const empty = status === "empty";
  const list = empty ? [] : longText ? longReviews : reviews;
  const up = (empty ? 0 : 24180) + (vote === "up" ? 1 : 0);
  const down = (empty ? 0 : 1520) + (vote === "down" ? 1 : 0);
  const total = up + down;
  const ratio = total === 0 ? 0 : Math.round((up / total) * 100);

  function retry() {
    setStatus("loading");
    setTimeout(() => setStatus("default"), 800);
  }

  if (status === "loading") {
    return (
      <div role="status" aria-busy="true" aria-label="게임 정보를 불러오는 중">
        <div className="gdt-skeleton-hero">
          <Skeleton style={{ height: 48, width: "min(420px, 80%)" }} />
          <Skeleton style={{ height: 16, width: 160 }} />
          <Skeleton style={{ height: 44, width: "min(360px, 90%)" }} />
          <Skeleton style={{ height: 48, width: 200 }} />
        </div>
        <div className="gdt-body">
          <div className="gdt-main">
            <div className="gdt-shots">
              {[0, 1, 2].map((key) => (
                <Skeleton
                  key={key}
                  style={{ height: 200, aspectRatio: "16 / 9", flexShrink: 0 }}
                />
              ))}
            </div>
            <Stack gap={8}>
              <Skeleton style={{ height: 24, width: 120 }} />
              <Skeleton style={{ height: 16 }} />
              <Skeleton style={{ height: 16, width: "80%" }} />
            </Stack>
          </div>
          <div className="gdt-aside">
            <Skeleton style={{ height: 112, borderRadius: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="gdt-error">
        <Alert>
          <Stack gap={12} align="start">
            <div>
              <AlertTitle>게임 정보를 불러오지 못했습니다</AlertTitle>
              <AlertDescription>
                게임이 비공개로 바뀌었거나 네트워크 연결이 끊겼을 수 있습니다.
              </AlertDescription>
            </div>
            <Button size="sm" variant="standard" onClick={retry}>
              다시 시도
            </Button>
          </Stack>
        </Alert>
      </div>
    );
  }

  const reviewList = (items: Review[]) =>
    items.map((review) => (
      <ReviewItem
        key={review.id}
        review={review}
        developer={developer}
        onReport={() => toast.add({ title: "리뷰 신고를 접수했습니다" })}
      />
    ));

  return (
    <>
      <header className="gdt-hero">
        <img className="gdt-hero-art" src={art(205)} alt="" />
        <div className="gdt-hero-inner">
          <div className="gdt-byline">
            <h1 className="gdt-title">{title}</h1>
            <a className="gdt-developer" href="#creator">
              {developer}
            </a>
            <p className="gdt-fine">게임 내 구매 · 음성 채팅 지원</p>
          </div>

          <div className="gdt-summary">
            <img
              className="gdt-icon"
              src={art(205, { ratio: "square" })}
              alt=""
            />
            <dl className="gdt-stats" tabIndex={0} aria-label="게임 요약">
              <div>
                <dt>{total ? `평가 ${count(total)}개` : "평가 없음"}</dt>
                <dd>{total ? `${ratio}% 추천` : "–"}</dd>
              </div>
              <div>
                <dt>플레이 중</dt>
                <dd>3.2만</dd>
              </div>
              <div>
                <dt>누적 방문</dt>
                <dd>1,240만+</dd>
              </div>
              <div>
                <dt>이용 등급</dt>
                <dd>
                  <span className="gdt-age" aria-hidden="true">
                    12
                  </span>
                  12세 이상
                </dd>
              </div>
            </dl>
          </div>

          <div className="gdt-actions">
            <Button
              className="gdt-play"
              size="lg"
              onClick={() =>
                toast.add({ title: "Roblox 앱에서 게임을 엽니다" })
              }
            >
              플레이
            </Button>
            <Button
              size="md"
              variant="over-media"
              onClick={() => toast.add({ title: "링크를 복사했습니다" })}
            >
              <Share2 size={18} aria-hidden="true" />
              공유
            </Button>
            <Button
              size="md"
              variant="over-media"
              aria-pressed={wish}
              onClick={() => {
                setWish(!wish);
                toast.add({
                  title: wish
                    ? "위시리스트에서 뺐습니다"
                    : "위시리스트에 추가했습니다",
                });
              }}
            >
              {wish ? (
                <BookmarkCheck size={18} aria-hidden="true" />
              ) : (
                <BookmarkPlus size={18} aria-hidden="true" />
              )}
              위시리스트
            </Button>
            <Button
              className="gdt-trailer"
              size="md"
              variant="over-media"
              onClick={() => setShot(0)}
            >
              <Play size={16} aria-hidden="true" />
              트레일러
            </Button>
          </div>

          <p className="gdt-note">
            <span>
              <MonitorSmartphone size={16} aria-hidden="true" />
              휴대폰·태블릿·PC·콘솔에서 플레이할 수 있어요.
            </span>
            <span>
              <Users size={16} aria-hidden="true" />한 서버에 12명까지 함께
              플레이해요.
            </span>
          </p>
        </div>
      </header>

      <div className="gdt-body">
        <main className="gdt-main">
          <section className="gdt-gallery" aria-label="스크린샷">
            <ul className="gdt-shots" ref={shotsRef}>
              {shots.map(([hue, caption], index) => (
                <li key={hue}>
                  <button
                    type="button"
                    className="gdt-shot"
                    aria-label={`스크린샷 ${index + 1}, ${caption}, 크게 보기`}
                    onClick={() => setShot(index)}
                  >
                    <img src={art(hue, { caption })} alt="" />
                  </button>
                </li>
              ))}
            </ul>
            {(["start", "end"] as const).map((side) => (
              <IconButton
                key={side}
                className="gdt-gallery-nav"
                data-side={side}
                icon={side === "start" ? <ChevronLeft /> : <ChevronRight />}
                variant="standard"
                circular
                size="md"
                aria-label={
                  side === "start" ? "이전 스크린샷" : "다음 스크린샷"
                }
                onClick={() =>
                  shotsRef.current?.scrollBy({
                    left: (side === "start" ? -1 : 1) * 380,
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  })
                }
              />
            ))}
          </section>

          <section className="gdt-section" aria-labelledby="gdt-about">
            <h2 id="gdt-about" className="gdt-h2">
              <button
                type="button"
                className="gdt-h2-button"
                onClick={() => setAbout(true)}
              >
                게임 소개
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </h2>
            <p className="gdt-clamp">{description}</p>
            <dl className="gdt-fact">
              <dt>업데이트 날짜</dt>
              <dd>
                <time dateTime="2026-10-24">2026. 10. 24.</time>
              </dd>
            </dl>
            <ul className="gdt-tags" aria-label="장르와 특징">
              {[
                "어드벤처",
                "퍼즐",
                "멀티플레이어",
                "협동",
                "탐험",
                "캐주얼",
              ].map((tag) => (
                <li key={tag}>
                  <a href={`#tag-${tag}`}>{tag}</a>
                </li>
              ))}
            </ul>
          </section>

          <section className="gdt-section" aria-labelledby="gdt-event">
            <h2 id="gdt-event" className="gdt-h2">
              이벤트 및 혜택
            </h2>
            <article className="gdt-event">
              <div className="gdt-event-copy">
                <p className="gdt-muted">3일 후 종료</p>
                <h3>
                  <a href="#event-whale">하늘 고래 레이드 주간</a>
                </h3>
                <p className="gdt-muted">
                  레이드 보상 두 배, 한정 고래 꼬리 장식을 받아 가세요.
                </p>
              </div>
              <img src={art(260)} alt="" />
            </article>
          </section>

          <section className="gdt-section" aria-labelledby="gdt-rating">
            <div className="gdt-section-head">
              <h2 id="gdt-rating" className="gdt-h2">
                {list.length > 0 ? (
                  <button
                    type="button"
                    className="gdt-h2-button"
                    onClick={() => setAllReviews(true)}
                  >
                    평가 및 리뷰
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                ) : (
                  "평가 및 리뷰"
                )}
              </h2>
              <span className="gdt-muted">
                플레이한 사람만 평가할 수 있어요
              </span>
            </div>

            <Inline role="group" aria-label="평가한 기기" gap={8}>
              {devices.map((name) => (
                <Toggle
                  key={name}
                  pressed={device === name}
                  onPressedChange={() => setDevice(name)}
                >
                  {name}
                </Toggle>
              ))}
            </Inline>

            {total === 0 ? (
              <p className="gdt-muted">
                아직 {device}에서 남긴 평가가 없어요. 플레이해 보고 첫 평가를
                남겨 주세요.
              </p>
            ) : (
              <div className="gdt-rating">
                <div className="gdt-score">
                  <strong>{ratio}%</strong>
                  <span className="gdt-score-verdict">
                    <ThumbsUp size={16} aria-hidden="true" /> 매우 긍정적
                  </span>
                  <span className="gdt-muted">평가 {count(total)}개</span>
                </div>
                {/* 평가 컴포넌트(6단계)가 없어 막대를 화면에서 그립니다(2차 2-M14). */}
                <dl className="gdt-bars">
                  {(
                    [
                      ["추천", (up / total) * 100, `${count(up)}명`, "up"],
                      [
                        "비추천",
                        (down / total) * 100,
                        `${count(down)}명`,
                        "down",
                      ],
                      ["최근 30일", 96, "96% 추천", "up"],
                    ] as const
                  ).map(([label, width, value, tone]) => (
                    <div className="gdt-bar" key={label}>
                      <dt>{label}</dt>
                      <div className="gdt-bar-track" aria-hidden="true">
                        <div
                          className="gdt-bar-fill"
                          data-tone={tone}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="gdt-mine">
              <p className="gdt-review-author">이 게임을 추천하나요?</p>
              <p className="gdt-muted">
                다른 플레이어가 게임을 고를 때 도움이 돼요.
              </p>
              <div className="gdt-mine-row">
                <IconButton
                  icon={<ThumbsUp />}
                  variant="standard"
                  selected={vote === "up"}
                  aria-pressed={vote === "up"}
                  aria-label="추천"
                  onClick={() => setVote(vote === "up" ? null : "up")}
                />
                <IconButton
                  icon={<ThumbsDown />}
                  variant="standard"
                  selected={vote === "down"}
                  aria-pressed={vote === "down"}
                  aria-label="비추천"
                  onClick={() => setVote(vote === "down" ? null : "down")}
                />
                <Button
                  size="md"
                  variant="standard"
                  onClick={() => setWriting(true)}
                >
                  리뷰 쓰기
                </Button>
              </div>
            </div>

            {list.length > 0 && (
              <div className="gdt-reviews">{reviewList(list.slice(0, 3))}</div>
            )}
            {list.length > 3 && (
              <Inline>
                <Button
                  size="md"
                  variant="standard"
                  onClick={() => setAllReviews(true)}
                >
                  리뷰 {list.length}개 모두 보기
                </Button>
              </Inline>
            )}
          </section>

          <section className="gdt-section" aria-labelledby="gdt-new">
            <h2 id="gdt-new" className="gdt-h2">
              새로운 기능
            </h2>
            <ol className="gdt-changes">
              <li>하늘 고래 레이드 보스 추가 (10/24~11/7)</li>
              <li>섬 이동 중 재료가 사라지는 문제 수정</li>
              <li>배 꾸미기 장식 12종 추가</li>
              <li>휴대폰에서 지도 열기 속도 개선</li>
            </ol>
          </section>

          <Inline>
            <Button size="sm" variant="utility" onClick={() => setReport(true)}>
              <Flag size={16} aria-hidden="true" />
              부적절한 게임으로 신고
            </Button>
          </Inline>
        </main>

        <aside className="gdt-aside" aria-label="게임 정보">
          <div className="gdt-age-card">
            <span className="gdt-age" aria-hidden="true">
              12
            </span>
            <strong>12세 이상</strong>
            <span className="gdt-muted">가벼운 폭력성 · 게임 내 구매</span>
            <a href="#age-rating">자세히 알아보기</a>
          </div>

          <Collapsible.Root className="gdt-support">
            <Collapsible.Trigger
              render={<button type="button" className="gdt-support-trigger" />}
            >
              게임 지원
              <ChevronDown size={20} aria-hidden="true" />
            </Collapsible.Trigger>
            <Collapsible.Panel>
              <ul className="gdt-support-list">
                <li>
                  <a href="#site">
                    <Globe size={20} aria-hidden="true" />
                    <strong>웹사이트</strong>
                    <span>haneul-gongbang.example</span>
                  </a>
                </li>
                <li>
                  <a href="#mail">
                    <Mail size={20} aria-hidden="true" />
                    <strong>지원 이메일</strong>
                    <span>help@haneul-gongbang.example</span>
                  </a>
                </li>
                <li>
                  <a href="#privacy">
                    <ShieldCheck size={20} aria-hidden="true" />
                    <strong>개인정보처리방침</strong>
                    <span>최종 수정 2026. 9. 1.</span>
                  </a>
                </li>
              </ul>
            </Collapsible.Panel>
          </Collapsible.Root>

          <section className="gdt-section" aria-labelledby="gdt-similar">
            <h2 id="gdt-similar" className="gdt-h2">
              비슷한 게임
            </h2>
            <ul className="gdt-mini-list">
              {similar.map(([id, name, creator, like, hue]) => (
                <MiniGame
                  key={id}
                  id={id}
                  title={name}
                  creator={creator}
                  like={like}
                  hue={hue}
                />
              ))}
            </ul>
          </section>

          <section className="gdt-section" aria-labelledby="gdt-more">
            <h2 id="gdt-more" className="gdt-h2">
              {developer}의 게임 더보기
            </h2>
            <ul className="gdt-mini-list">
              {more.map(([id, name, creator, like, hue]) => (
                <MiniGame
                  key={id}
                  id={id}
                  title={name}
                  creator={creator}
                  like={like}
                  hue={hue}
                />
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* 스크린샷 크게 보기 */}
      <Dialog.Root
        open={shot !== null}
        onOpenChange={(open) => !open && setShot(null)}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="lg">
            <Dialog.CloseAffordance />
            <Dialog.Title>
              스크린샷 {(shot ?? 0) + 1}/{shots.length}
            </Dialog.Title>
            <Dialog.Body>
              {shot !== null && (
                <img
                  className="gdt-lightbox"
                  src={art(shots[shot][0], { caption: shots[shot][1] })}
                  alt={shots[shot][1]}
                />
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                size="md"
                variant="standard"
                disabled={shot === 0}
                onClick={() => setShot((shot ?? 0) - 1)}
              >
                이전
              </Button>
              <Button
                size="md"
                variant="standard"
                disabled={shot === shots.length - 1}
                onClick={() => setShot((shot ?? 0) + 1)}
              >
                다음
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 게임 소개 전체와 상세 정보 */}
      <Dialog.Root open={about} onOpenChange={setAbout}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="lg">
            <Dialog.CloseAffordance />
            <Dialog.Title>게임 소개</Dialog.Title>
            <Dialog.Description>{title}</Dialog.Description>
            <Dialog.Body>
              <div className="gdt-dialog-scroll">
                <p className="gdt-pre">{description}</p>
                <h3 className="gdt-h2">게임 정보</h3>
                <dl className="gdt-info-grid">
                  {[
                    ["버전", "2.14.0"],
                    ["업데이트", "2026. 10. 24."],
                    ["만든 날", "2024. 7. 12."],
                    ["최대 인원", "서버당 12명"],
                    ["장르", "어드벤처"],
                    ["즐겨찾기", "48만"],
                    ["음성 채팅", "지원"],
                    ["지원 기기", "휴대폰, 태블릿, PC, 콘솔"],
                  ].map(([label, value]) => (
                    <div className="gdt-fact" key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Dialog.Body>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 리뷰 전체 */}
      <Dialog.Root open={allReviews} onOpenChange={setAllReviews}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup size="lg">
            <Dialog.CloseAffordance />
            <Dialog.Title>평가 및 리뷰</Dialog.Title>
            <Dialog.Description>
              리뷰 {list.length}개 · 도움이 된 순
            </Dialog.Description>
            <Dialog.Body>
              <div className="gdt-dialog-scroll gdt-reviews">
                {reviewList(list)}
              </div>
            </Dialog.Body>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 리뷰 쓰기 */}
      <Dialog.Root open={writing} onOpenChange={setWriting}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Title>리뷰 쓰기</Dialog.Title>
            <Dialog.Description>
              공개 리뷰에는 표시 이름이 함께 보여요.
            </Dialog.Description>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setWriting(false);
                toast.add({ title: "리뷰를 올렸습니다" });
              }}
            >
              <Dialog.Body>
                <Stack gap={16}>
                  <Inline gap={8} role="group" aria-label="추천 여부">
                    <Toggle
                      pressed={vote === "up"}
                      onPressedChange={() => setVote("up")}
                    >
                      <ThumbsUp size={16} aria-hidden="true" /> 추천
                    </Toggle>
                    <Toggle
                      pressed={vote === "down"}
                      onPressedChange={() => setVote("down")}
                    >
                      <ThumbsDown size={16} aria-hidden="true" /> 비추천
                    </Toggle>
                  </Inline>
                  <Field.Root name="review">
                    <Field.Label>리뷰</Field.Label>
                    <Field.Control
                      render={<Textarea rows={4} />}
                      placeholder="어떤 점이 좋았거나 아쉬웠나요?"
                      required
                      maxLength={500}
                    />
                    <Field.Description>
                      500자까지 쓸 수 있어요.
                    </Field.Description>
                    <Field.Error match="valueMissing">
                      리뷰 내용을 입력하세요.
                    </Field.Error>
                  </Field.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button size="md" variant="standard" />}>
                  취소
                </Dialog.Close>
                <Button size="md" type="submit">
                  올리기
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 게임 신고 */}
      <Dialog.Root open={report} onOpenChange={setReport}>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Title>게임 신고</Dialog.Title>
            <Dialog.Description>
              신고 내용은 제작자에게 공개되지 않아요.
            </Dialog.Description>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setReport(false);
                toast.add({ title: "신고를 접수했습니다" });
              }}
            >
              <Dialog.Body>
                <RadioGroup
                  className="gdt-report"
                  defaultValue="inappropriate"
                  aria-label="신고 이유"
                >
                  {[
                    ["inappropriate", "부적절한 내용"],
                    ["scam", "사기 또는 개인정보 요구"],
                    ["copyright", "저작권 침해"],
                    ["other", "기타"],
                  ].map(([value, label]) => (
                    <label key={value}>
                      <Radio.Root value={value}>
                        <Radio.Indicator />
                      </Radio.Root>
                      {label}
                    </label>
                  ))}
                </RadioGroup>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button size="md" variant="standard" />}>
                  취소
                </Dialog.Close>
                <Button size="md" variant="alert" type="submit">
                  신고하기
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export function GameDetailExample({
  state = "default",
  longText = false,
}: {
  /** 화면의 데이터 상태입니다. empty는 평가와 리뷰가 아직 없는 상태입니다. @defaultValue "default" */
  state?: GameDetailState;
  /** 긴 한국어 제목·리뷰로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
}) {
  return (
    <Toast.Provider>
      <div className="gdt">
        <Detail
          key={`${state}-${longText}`}
          state={state}
          longText={longText}
        />
      </div>
      <Toast.Toaster />
    </Toast.Provider>
  );
}
