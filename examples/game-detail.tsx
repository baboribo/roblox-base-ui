"use client";
import { useState } from "react";
import {
  ChevronDown,
  Heart,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "../src/components/ui/breadcrumb";
import { Badge } from "../src/components/ui/badge";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Icon } from "../src/components/ui/icon";
import { Avatar } from "../src/components/ui/avatar";
import { Menu } from "../src/components/ui/menu";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Textarea } from "../src/components/ui/textarea";
import { Toast } from "../src/components/ui/toast";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { Stack } from "../src/components/ui/layout";
import "./game-detail.css";

// 대표 화면 6번 게임 상세입니다. 구성은 대표 화면 명세(갤러리·게임 정보·통계·소개·평가·댓글)를 따르고,
// 화면 배치는 game-detail.css에 토큰으로만 적습니다. 라이브러리에 없어 화면에서 만든 부분은
// docs/engineering/COMPOSITION-REVIEW.md에 기록합니다.

/** 예제용 게임 그림입니다. 하늘·섬·캐릭터를 그립니다. */
function art(hue: number) {
  const [w, h] = [640, 360];
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
</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

type Comment = {
  id: string;
  author: string;
  date: string;
  text: string;
  likes: number;
};

const shortComments: Comment[] = [
  {
    id: "r1",
    author: "구름빵",
    date: "2026-10-25",
    text: "친구랑 같이 하니까 너무 재밌어요. 새 섬 업데이트 기다립니다!",
    likes: 128,
  },
  {
    id: "r2",
    author: "모험가토끼",
    date: "2026-10-22",
    text: "처음에 조작이 좀 어려웠는데 튜토리얼 보고 나니 괜찮아요.",
    likes: 41,
  },
  {
    id: "r3",
    author: "밤하늘",
    date: "2026-10-18",
    text: "모바일에서 가끔 끊겨요.",
    likes: 7,
  },
  {
    id: "r4",
    author: "섬지기",
    date: "2026-10-24",
    text: "보스전 음악이 정말 좋아요.",
    likes: 19,
  },
  {
    id: "r5",
    author: "새싹",
    date: "2026-10-12",
    text: "처음 해 봤는데 길 찾기가 조금 헷갈렸어요.",
    likes: 3,
  },
];

const longComments: Comment[] = shortComments.map((comment, index) => ({
  ...comment,
  author: index === 0 ? "아주아주긴닉네임을가진하늘섬탐험대장" : comment.author,
  text:
    index % 2 === 0
      ? `${comment.text} 그리고 이번 시즌에 추가된 하늘 고래 보스는 정말 멋있었는데 보상이 조금 적어서 여러 번 반복해야 하는 점이 아쉬웠고 다음 업데이트에서는 친구 초대 보상도 늘려 주시면 좋겠습니다.`
      : `${comment.text.replaceAll(" ", "")}ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ`,
}));

const shots = [205, 25, 140, 290, 45];

const sorts = { popular: "인기순", recent: "최신순" } as const;
type Sort = keyof typeof sorts;

const stats = [
  ["플레이 중", "3.2만"],
  ["즐겨찾기", "48만"],
  ["방문", "1,240만"],
  ["최대 인원", "12명"],
  ["장르", "어드벤처"],
  ["업데이트", "2026. 10. 24."],
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR");
}

function count(value: number) {
  return value.toLocaleString("ko-KR");
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
  const [shot, setShot] = useState(0);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [comments, setComments] = useState(() =>
    state === "empty" ? [] : longText ? longComments : shortComments,
  );
  const [sort, setSort] = useState<Sort>("popular");
  const [showAll, setShowAll] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const title = longText
    ? "하늘섬 탐험: 끝없이 이어지는 구름 너머 비밀의 왕국을 찾아 떠나는 여름방학 대모험 시즌 2"
    : "하늘섬 탐험";
  const up = 12840 + (vote === "up" ? 1 : 0);
  const down = 820 + (vote === "down" ? 1 : 0);
  const ratio = Math.round((up / (up + down)) * 100);
  const sorted = [...comments].sort((a, b) =>
    sort === "popular" ? b.likes - a.likes : b.date.localeCompare(a.date),
  );
  const visible = showAll ? sorted : sorted.slice(0, 3);

  if (status === "loading") {
    return (
      <div
        className="gdt"
        role="status"
        aria-busy="true"
        aria-label="게임 정보를 불러오는 중"
      >
        <Skeleton style={{ height: 16, width: 200 }} />
        <div className="gdt-top">
          <Skeleton style={{ aspectRatio: "16 / 9", borderRadius: 16 }} />
          <Stack gap={16}>
            <Skeleton style={{ height: 36, width: "80%" }} />
            <Skeleton style={{ height: 16, width: "40%" }} />
            <Skeleton style={{ height: 48 }} />
          </Stack>
        </div>
        <Skeleton style={{ height: 72, borderRadius: 16 }} />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="gdt">
        <Alert>
          <Stack gap={12} align="start">
            <div>
              <AlertTitle>게임 정보를 불러오지 못했습니다</AlertTitle>
              <AlertDescription>
                게임이 비공개로 바뀌었거나 네트워크 연결이 끊겼을 수 있습니다.
              </AlertDescription>
            </div>
            <Button
              size="sm"
              variant="standard"
              onClick={() => {
                setStatus("loading");
                setTimeout(() => setStatus("default"), 800);
              }}
            >
              다시 시도
            </Button>
          </Stack>
        </Alert>
      </div>
    );
  }

  return (
    <div className="gdt">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#discover">게임 탐색</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#adventure">어드벤처</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span aria-current="page">{title}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="gdt-top">
        <section className="gdt-gallery" aria-label="스크린샷">
          <img
            className="gdt-stage"
            src={art(shots[shot])}
            alt={`${title} 스크린샷 ${shot + 1}/${shots.length}`}
          />
          <div className="gdt-thumbs" role="group" aria-label="스크린샷 고르기">
            {shots.map((hue, index) => (
              <button
                key={hue}
                type="button"
                className="gdt-thumb"
                aria-pressed={index === shot}
                aria-label={`스크린샷 ${index + 1}`}
                onClick={() => setShot(index)}
              >
                <img src={art(hue)} alt="" />
              </button>
            ))}
          </div>
        </section>

        <div className="gdt-info">
          <Stack gap={8}>
            <h1 className="gdt-title">{title}</h1>
            <p className="gdt-creator">
              만든 사람 <a href="#creator">하늘공방 스튜디오</a>
            </p>
          </Stack>
          <div className="gdt-badges">
            <Badge>어드벤처</Badge>
            <Badge>12세 이상</Badge>
            <Badge variant="success">친구와 함께</Badge>
          </div>
          <div className="gdt-actions">
            <Button
              className="gdt-play"
              size="lg"
              onClick={() => toast.add({ title: "게임을 시작합니다" })}
            >
              플레이
            </Button>
            <IconButton
              icon={<Heart fill={favorite ? "currentColor" : "none"} />}
              size="lg"
              variant="standard"
              selected={favorite}
              aria-pressed={favorite}
              aria-label="즐겨찾기"
              onClick={() => setFavorite(!favorite)}
            />
            <IconButton
              icon={<Share2 />}
              size="lg"
              variant="standard"
              aria-label="공유"
              onClick={() => toast.add({ title: "링크를 복사했습니다" })}
            />
          </div>
          <p className="gdt-quick">
            <span>
              <ThumbsUp size={14} aria-hidden="true" />
              추천 {ratio}%
            </span>
            <span>
              <Users size={14} aria-hidden="true" />
              3.2만 명 플레이 중
            </span>
          </p>
        </div>
      </div>

      <dl className="gdt-stats" aria-label="게임 정보">
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <section className="gdt-section" aria-labelledby="gdt-about">
        <h2 id="gdt-about" className="gdt-h2">
          게임 소개
        </h2>
        <div className="gdt-about">
          <p>
            구름 위에 떠 있는 섬들을 탐험하며 숨겨진 보물을 찾는 어드벤처
            게임입니다. 친구와 함께 배를 만들어 다음 섬으로 이동하세요.
          </p>
          <p>
            매주 금요일 새 섬이 열리고, 시즌 보상으로 아바타 장식을 받을 수
            있습니다. 12세 이상 이용 가능하며 게임 안 구매가 있습니다.
          </p>
        </div>
      </section>

      <section className="gdt-section" aria-labelledby="gdt-rating">
        <h2 id="gdt-rating" className="gdt-h2">
          평가
        </h2>
        {/* 평가 컴포넌트(6단계)가 없어 비율과 막대를 화면에서 그립니다(2차 2-M14). */}
        <div className="gdt-rating">
          <p className="gdt-score">
            <strong>{ratio}%</strong>
            <span>추천 {count(up + down)}명 중</span>
          </p>
          <div className="gdt-split">
            <div className="gdt-split-track" aria-hidden="true">
              <div
                className="gdt-split-up"
                style={{ width: `${(up / (up + down)) * 100}%` }}
              />
            </div>
            <p className="gdt-split-legend">
              <span>좋아요 {count(up)}</span>
              <span>싫어요 {count(down)}</span>
            </p>
          </div>
          <div className="gdt-vote">
            <p>해 보셨나요?</p>
            <IconButton
              icon={<ThumbsUp />}
              variant="standard"
              selected={vote === "up"}
              aria-pressed={vote === "up"}
              aria-label="좋아요"
              onClick={() => setVote(vote === "up" ? null : "up")}
            />
            <IconButton
              icon={<ThumbsDown />}
              variant="standard"
              selected={vote === "down"}
              aria-pressed={vote === "down"}
              aria-label="싫어요"
              onClick={() => setVote(vote === "down" ? null : "down")}
            />
          </div>
        </div>
      </section>

      <section className="gdt-section" aria-labelledby="gdt-comments">
        <div className="gdt-section-head">
          <h2 id="gdt-comments" className="gdt-h2">
            댓글 {comments.length}개
          </h2>
          {comments.length > 1 && (
            <Menu.Root>
              <Menu.Trigger
                render={<Button size="sm" variant="utility" />}
                aria-label={`정렬: ${sorts[sort]}`}
              >
                {sorts[sort]}
                <ChevronDown size={16} aria-hidden="true" />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner sideOffset={4} align="end">
                  <Menu.Popup size="sm">
                    <Menu.RadioGroup
                      value={sort}
                      onValueChange={(value) => setSort(value as Sort)}
                    >
                      {(Object.keys(sorts) as Sort[]).map((key) => (
                        <Menu.RadioItem key={key} value={key}>
                          {sorts[key]}
                          <Menu.RadioItemIndicator>
                            <Icon name="icon-filled-check" size={16} />
                          </Menu.RadioItemIndicator>
                        </Menu.RadioItem>
                      ))}
                    </Menu.RadioGroup>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          )}
        </div>

        <Form
          className="gdt-write"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const text = String(new FormData(form).get("comment")).trim();
            setComments((list) => [
              {
                id: `n${list.length}`,
                author: "나",
                date: new Date().toISOString().slice(0, 10),
                text,
                likes: 0,
              },
              ...list,
            ]);
            setSort("recent");
            form.reset();
            toast.add({ title: "댓글을 등록했습니다" });
          }}
        >
          <Field.Root name="comment">
            {/* 구역 제목이 바로 위에 있어 보이는 라벨 대신 접근 가능한 이름만 줍니다. */}
            <Field.Control
              render={<Textarea rows={2} controlSize="md" />}
              aria-label="댓글 쓰기"
              placeholder="다른 플레이어를 존중하는 댓글을 남겨 주세요."
              required
              maxLength={300}
            />
            <Field.Error match="valueMissing">댓글을 입력하세요.</Field.Error>
          </Field.Root>
          <div className="gdt-write-actions">
            <Button type="submit" size="md">
              등록
            </Button>
          </div>
        </Form>

        {comments.length === 0 ? (
          <p className="gdt-muted">
            아직 댓글이 없습니다. 첫 번째로 플레이 후기를 남겨 보세요.
          </p>
        ) : (
          // 댓글 컴포넌트(6단계)가 없어 화면에서 만듭니다. List는 본문 자리가 부족합니다(3.5단계 N9).
          <ul className="gdt-comments">
            {visible.map((comment) => {
              const isLiked = liked.includes(comment.id);
              const likes = comment.likes + (isLiked ? 1 : 0);
              return (
                <li className="gdt-comment" key={comment.id}>
                  <Avatar.Root>
                    <Avatar.Fallback>
                      {comment.author.slice(0, 1)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="gdt-comment-body">
                    <p className="gdt-comment-head">
                      <strong>{comment.author}</strong>
                      <time dateTime={comment.date}>
                        {formatDate(comment.date)}
                      </time>
                    </p>
                    <p className="gdt-comment-text">{comment.text}</p>
                    <p className="gdt-comment-like">
                      <IconButton
                        icon={<ThumbsUp />}
                        size="sm"
                        variant="utility"
                        selected={isLiked}
                        aria-pressed={isLiked}
                        aria-label={`도움이 돼요 ${likes}명`}
                        onClick={() =>
                          setLiked((list) =>
                            isLiked
                              ? list.filter((id) => id !== comment.id)
                              : [...list, comment.id],
                          )
                        }
                      />
                      <span aria-hidden="true">{likes}</span>
                    </p>
                  </div>
                  <Menu.Root>
                    <Menu.Trigger
                      render={
                        <IconButton
                          icon={<MoreHorizontal />}
                          size="sm"
                          variant="utility"
                          aria-label={`${comment.author}의 댓글 더보기`}
                        />
                      }
                    />
                    <Menu.Portal>
                      <Menu.Positioner sideOffset={4} align="end">
                        <Menu.Popup size="sm">
                          <Menu.Item
                            onClick={() =>
                              toast.add({ title: "신고를 접수했습니다" })
                            }
                          >
                            신고
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              toast.add({
                                title: `${comment.author}의 댓글을 숨겼습니다`,
                              })
                            }
                          >
                            이 사용자 숨기기
                          </Menu.Item>
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.Root>
                </li>
              );
            })}
          </ul>
        )}
        {!showAll && comments.length > 3 && (
          <div>
            <Button
              size="md"
              variant="standard"
              onClick={() => setShowAll(true)}
            >
              댓글 {comments.length - 3}개 더 보기
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export function GameDetailExample({
  state = "default",
  longText = false,
}: {
  /** 화면의 데이터 상태입니다. empty는 댓글이 없는 상태입니다. @defaultValue "default" */
  state?: GameDetailState;
  /** 긴 한국어 제목·댓글로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
}) {
  return (
    <Toast.Provider>
      <Detail key={`${state}-${longText}`} state={state} longText={longText} />
      <Toast.Toaster />
    </Toast.Provider>
  );
}
