"use client";
import { useState } from "react";
import {
  Heart,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "../src/components/ui/breadcrumb";
import { CardImage, CardMedia } from "../src/components/ui/card";
import { Carousel } from "../src/components/ui/carousel";
import { Badge } from "../src/components/ui/badge";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Toggle } from "../src/components/ui/toggle";
import { Meter } from "../src/components/ui/meter";
import { Collapsible } from "../src/components/ui/collapsible";
import { Avatar } from "../src/components/ui/avatar";
import { Menu } from "../src/components/ui/menu";
import { Select } from "../src/components/ui/select";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Textarea } from "../src/components/ui/textarea";
import { Empty } from "../src/components/ui/empty";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import "./game-detail.css";

// 3단계 점검용 조합입니다. 기존 컴포넌트만 사용하고, 빠진 부분은 화면 CSS로만 채웁니다.
// 화면 CSS로 채운 곳은 docs/engineering/SCREENS-AUDIT-2.md에 문제로 기록했습니다.

function screenshot(hue: number) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="hsl(${hue} 55% 62%)"/><path d="m0 150 90-70 70 50 70-90 90 110v30H0z" fill="hsl(${hue} 45% 38%)"/></svg>`,
    )
  );
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
    date: "2026. 10. 25.",
    text: "친구랑 같이 하니까 너무 재밌어요. 새 섬 업데이트 기다립니다!",
    likes: 128,
  },
  {
    id: "r2",
    author: "모험가토끼",
    date: "2026. 10. 22.",
    text: "처음에 조작이 좀 어려웠는데 튜토리얼 보고 나니 괜찮아요.",
    likes: 41,
  },
  {
    id: "r3",
    author: "밤하늘",
    date: "2026. 10. 18.",
    text: "모바일에서 가끔 끊겨요.",
    likes: 7,
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

const sorts = [
  { value: "popular", label: "인기순" },
  { value: "recent", label: "최신순" },
];

export type GameDetailState = "default" | "loading" | "empty" | "error";

export function GameDetailExample({
  state = "default",
  longText = false,
}: {
  /** 화면의 데이터 상태입니다. empty는 댓글이 없는 상태입니다. @defaultValue "default" */
  state?: GameDetailState;
  /** 긴 한국어 제목·댓글로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
}) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [comments, setComments] = useState(() =>
    state === "empty" ? [] : longText ? longComments : shortComments,
  );
  const [liked, setLiked] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const title = longText
    ? "하늘섬 탐험: 끝없이 이어지는 구름 너머 비밀의 왕국을 찾아 떠나는 여름방학 대모험 시즌 2"
    : "하늘섬 탐험";
  const up = 12840 + (vote === "up" ? 1 : 0);
  const down = 820 + (vote === "down" ? 1 : 0);
  const ratio = Math.round((up / (up + down)) * 100);

  if (state === "loading") {
    return (
      <div className="gdd-page" aria-busy="true">
        <Skeleton className="gdd-skeleton-title" />
        <Skeleton className="gdd-skeleton-media" />
        <Skeleton className="gdd-skeleton-line" />
        <Skeleton className="gdd-skeleton-line" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="gdd-page">
        <Alert>
          <AlertTitle>게임 정보를 불러오지 못했습니다</AlertTitle>
          <AlertDescription>
            게임이 비공개로 바뀌었거나 네트워크 연결이 끊겼을 수 있습니다.
          </AlertDescription>
          <Button size="sm" variant="standard" className="gdd-retry">
            다시 시도
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <article className="gdd-page" aria-labelledby="gdd-title">
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

      <header className="gdd-header">
        {/* 독립 이미지 컴포넌트가 없어 CardMedia를 Card 밖에서 씁니다. */}
        <CardMedia ratio="square" className="gdd-icon">
          <CardImage src={screenshot(205)} alt="" />
        </CardMedia>
        <div className="gdd-heading">
          {/* Typography Heading은 h2만 있어 h1을 직접 씁니다. */}
          <h1 id="gdd-title" className="gdd-title">
            {title}
          </h1>
          <a href="#creator" className="gdd-creator">
            하늘공방 스튜디오
          </a>
          <div className="gdd-badges">
            <Badge>어드벤처</Badge>
            <Badge variant="success">친구와 함께</Badge>
          </div>
        </div>
      </header>

      {/* 통계: 설명 목록(dl) 컴포넌트가 없어 화면 CSS로 만듭니다. */}
      <dl className="gdd-stats">
        <div>
          <dt>좋아요</dt>
          <dd>{ratio}%</dd>
        </div>
        <div>
          <dt>플레이 중</dt>
          <dd>3.2만</dd>
        </div>
        <div>
          <dt>방문</dt>
          <dd>1,240만</dd>
        </div>
        <div>
          <dt>최대 인원</dt>
          <dd>12명</dd>
        </div>
      </dl>

      <div className="gdd-actions">
        <Button size="lg" className="gdd-play">
          플레이
        </Button>
        <Toggle
          pressed={favorite}
          onPressedChange={setFavorite}
          aria-label="즐겨찾기"
        >
          <Heart size={20} fill={favorite ? "currentColor" : "none"} />
        </Toggle>
        <IconButton
          icon={<Share2 />}
          size="lg"
          variant="standard"
          aria-label="공유"
          onClick={() => setStatus("링크를 복사했습니다.")}
        />
      </div>

      <section className="gdd-section" aria-labelledby="gdd-shots">
        <h2 id="gdd-shots" className="gdd-section-title">
          스크린샷
        </h2>
        <Carousel
          label="스크린샷"
          items={[205, 140, 25, 290, 0].map((hue, index) => ({
            id: `s${index}`,
            title: `스크린샷 ${index + 1}`,
            media: <img className="gdd-shot" src={screenshot(hue)} alt="" />,
          }))}
        />
      </section>

      <section className="gdd-section" aria-labelledby="gdd-about">
        <h2 id="gdd-about" className="gdd-section-title">
          게임 정보
        </h2>
        <p className="gdd-description">
          구름 위에 떠 있는 섬들을 탐험하며 숨겨진 보물을 찾는 어드벤처
          게임입니다. 친구와 함께 배를 만들어 다음 섬으로 이동하세요.
        </p>
        <Collapsible.Root>
          <Collapsible.Panel>
            <p className="gdd-description">
              매주 금요일 새 섬이 열리고, 시즌 보상으로 아바타 장식을 받을 수
              있습니다. 12세 이상 이용 가능하며 게임 안 구매가 있습니다.
            </p>
          </Collapsible.Panel>
          <Collapsible.Trigger
            className="gdd-more"
            data-variant="utility"
            data-size="sm"
          >
            더 보기
          </Collapsible.Trigger>
        </Collapsible.Root>
      </section>

      <section className="gdd-section" aria-labelledby="gdd-rating">
        <h2 id="gdd-rating" className="gdd-section-title">
          평가
        </h2>
        {/* 평가 컴포넌트(6단계)가 없어 Meter와 Toggle로 만듭니다. */}
        <div className="gdd-rating">
          <Meter.Root value={ratio} aria-label="좋아요 비율">
            <div className="gdd-rating-head">
              <span className="gdd-rating-value">{ratio}%</span>
              <span className="gdd-rating-count">
                좋아요 {up.toLocaleString("ko-KR")} · 싫어요{" "}
                {down.toLocaleString("ko-KR")}
              </span>
            </div>
            <Meter.Track>
              <Meter.Indicator />
            </Meter.Track>
          </Meter.Root>
          <div className="gdd-vote" role="group" aria-label="이 게임 평가">
            <Toggle
              pressed={vote === "up"}
              onPressedChange={(pressed) => setVote(pressed ? "up" : null)}
              aria-label="좋아요"
            >
              <ThumbsUp size={20} />
            </Toggle>
            <Toggle
              pressed={vote === "down"}
              onPressedChange={(pressed) => setVote(pressed ? "down" : null)}
              aria-label="싫어요"
            >
              <ThumbsDown size={20} />
            </Toggle>
          </div>
        </div>
      </section>

      <section className="gdd-section" aria-labelledby="gdd-comments">
        <div className="gdd-section-head">
          <h2 id="gdd-comments" className="gdd-section-title">
            댓글 {comments.length}개
          </h2>
          <div className="gdd-sort">
            <Select label="정렬" options={sorts} defaultValue="popular" />
          </div>
        </div>

        <Form
          className="gdd-comment-form"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const text = String(new FormData(form).get("comment")).trim();
            setComments((list) => [
              {
                id: `n${list.length}`,
                author: "나",
                date: "방금",
                text,
                likes: 0,
              },
              ...list,
            ]);
            form.reset();
          }}
        >
          <Field.Root name="comment">
            <Field.Label>댓글 쓰기</Field.Label>
            <Field.Control
              render={<Textarea rows={3} controlSize="md" />}
              placeholder="다른 플레이어를 존중하는 댓글을 남겨 주세요."
              required
              maxLength={300}
            />
            <Field.Error match="valueMissing">댓글을 입력하세요.</Field.Error>
          </Field.Root>
          <Button type="submit" size="md" className="gdd-comment-submit">
            등록
          </Button>
        </Form>

        {comments.length === 0 ? (
          <Empty>
            <h3>아직 댓글이 없습니다</h3>
            <p>첫 번째로 플레이 후기를 남겨 보세요.</p>
          </Empty>
        ) : (
          // 댓글 컴포넌트가 없어 ul + article로 만듭니다.
          <ul className="gdd-comment-list">
            {comments.map((comment) => (
              <li key={comment.id}>
                <article
                  className="gdd-comment"
                  aria-label={`${comment.author}의 댓글`}
                >
                  <Avatar.Root className="gdd-comment-avatar">
                    <Avatar.Fallback>
                      {comment.author.slice(0, 1)}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="gdd-comment-body">
                    <header className="gdd-comment-meta">
                      <strong>{comment.author}</strong>
                      <time>{comment.date}</time>
                    </header>
                    <p className="gdd-comment-text">{comment.text}</p>
                    <Toggle
                      className="gdd-comment-like"
                      pressed={liked.includes(comment.id)}
                      onPressedChange={(pressed) =>
                        setLiked((list) =>
                          pressed
                            ? [...list, comment.id]
                            : list.filter((id) => id !== comment.id),
                        )
                      }
                      aria-label={`좋아요 ${comment.likes + (liked.includes(comment.id) ? 1 : 0)}개`}
                    >
                      <ThumbsUp size={16} />
                      {comment.likes + (liked.includes(comment.id) ? 1 : 0)}
                    </Toggle>
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
                            onClick={() => setStatus("신고를 접수했습니다.")}
                          >
                            신고
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              setStatus("이 사용자의 댓글을 숨깁니다.")
                            }
                          >
                            이 사용자 숨기기
                          </Menu.Item>
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.Root>
                </article>
              </li>
            ))}
          </ul>
        )}
        {comments.length > 0 && (
          <Button size="md" variant="standard" className="gdd-more-comments">
            댓글 더 보기
          </Button>
        )}
      </section>
      <p role="status" className="gdd-status">
        {status}
      </p>
    </article>
  );
}
