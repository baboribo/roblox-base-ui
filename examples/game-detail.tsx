"use client";
import { useState } from "react";
import {
  ChevronDown,
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
import { Card, CardImage, CardMedia } from "../src/components/ui/card";
import { Badge } from "../src/components/ui/badge";
import { Button } from "../src/components/ui/button";
import { IconButton } from "../src/components/ui/icon-button";
import { Icon } from "../src/components/ui/icon";
import { Meter } from "../src/components/ui/meter";
import { Avatar } from "../src/components/ui/avatar";
import { List } from "../src/components/ui/list";
import { Menu } from "../src/components/ui/menu";
import { Field } from "../src/components/ui/field";
import { Form } from "../src/components/ui/form";
import { Textarea } from "../src/components/ui/textarea";
import { Toast } from "../src/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/ui/table";
import { Empty } from "../src/components/ui/empty";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { Grid, Inline, Stack } from "../src/components/ui/layout";
import { Heading, Text } from "../src/components/ui/typography";

// 대표 화면 6번 게임 상세입니다. 라이브러리 컴포넌트와 배치 컴포넌트만으로 조립합니다.
// 화면 CSS 파일은 두지 않고, 라이브러리에 없어 생긴 한계는 docs/engineering/SCREENS-AUDIT-2.md에 기록합니다.

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
  const ratio = up / (up + down);
  const sorted = [...comments].sort((a, b) =>
    sort === "popular" ? b.likes - a.likes : b.date.localeCompare(a.date),
  );
  const visible = showAll ? sorted : sorted.slice(0, 3);

  if (status === "loading") {
    return (
      <Stack gap={32} aria-busy="true">
        <Skeleton style={{ height: 16, width: 200 }} />
        <Grid minItemWidth="20rem" gap={32}>
          <Skeleton style={{ aspectRatio: "16 / 9", borderRadius: 8 }} />
          <Stack gap={12}>
            <Skeleton style={{ height: 32, width: "70%" }} />
            <Skeleton style={{ height: 16, width: "40%" }} />
            <Skeleton style={{ height: 48 }} />
          </Stack>
        </Grid>
        <Skeleton style={{ height: 80 }} />
      </Stack>
    );
  }

  if (status === "error") {
    return (
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
    );
  }

  return (
    <Stack gap={48}>
      <Stack gap={24}>
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

        {/* Roblox 게임 페이지처럼 대표 이미지 옆에 제목·플레이를 둡니다. 좁은 화면에서는 위아래로 쌓입니다. */}
        <Grid minItemWidth="20rem" gap={32}>
          {/* 독립 이미지 컴포넌트가 없어 미디어만 있는 Card로 감쌉니다(1차 M3). */}
          <Card variant="plain">
            <CardMedia>
              <CardImage src={screenshot(205)} alt={`${title} 대표 이미지`} />
            </CardMedia>
          </Card>
          <Stack gap={24}>
            <Stack gap={8} align="start">
              {/* Heading은 h2만 있어 페이지 제목에 h1을 쓸 수 없습니다(1차 M7). */}
              <Heading>{title}</Heading>
              <Text>하늘공방 스튜디오</Text>
              <Inline gap={8}>
                <Badge>어드벤처</Badge>
                <Badge>12세 이상</Badge>
                <Badge variant="success">친구와 함께</Badge>
              </Inline>
            </Stack>
            <Inline gap={8}>
              <Button size="lg">플레이</Button>
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
            </Inline>
          </Stack>
        </Grid>
      </Stack>

      <Table aria-label="게임 정보">
        <TableHeader>
          <TableRow>
            {stats.map(([label]) => (
              <TableHead key={label} scope="col">
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {stats.map(([label, value]) => (
              <TableCell key={label}>{value}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>

      <section aria-labelledby="gdd-about">
        <Stack gap={12}>
          <Heading id="gdd-about">게임 소개</Heading>
          <Text>
            구름 위에 떠 있는 섬들을 탐험하며 숨겨진 보물을 찾는 어드벤처
            게임입니다. 친구와 함께 배를 만들어 다음 섬으로 이동하세요.
          </Text>
          <Text>
            매주 금요일 새 섬이 열리고, 시즌 보상으로 아바타 장식을 받을 수
            있습니다. 12세 이상 이용 가능하며 게임 안 구매가 있습니다.
          </Text>
        </Stack>
      </section>

      <section aria-labelledby="gdd-rating">
        <Stack gap={16}>
          <Heading id="gdd-rating">평가</Heading>
          {/* 평가 컴포넌트(6단계)가 없어 Meter와 IconButton으로 만듭니다(2차 2-M14). */}
          <Meter.Root value={ratio * 100}>
            <Inline justify="space-between" gap={12}>
              <Meter.Label>좋아요 비율</Meter.Label>
              <Meter.Value />
            </Inline>
            <Meter.Track>
              <Meter.Indicator />
            </Meter.Track>
          </Meter.Root>
          <Inline gap={8}>
            <IconButton
              icon={<ThumbsUp />}
              variant="standard"
              selected={vote === "up"}
              aria-pressed={vote === "up"}
              aria-label={`좋아요 ${up.toLocaleString("ko-KR")}개`}
              onClick={() => setVote(vote === "up" ? null : "up")}
            />
            <Text aria-hidden="true">{up.toLocaleString("ko-KR")}</Text>
            <IconButton
              icon={<ThumbsDown />}
              variant="standard"
              selected={vote === "down"}
              aria-pressed={vote === "down"}
              aria-label={`싫어요 ${down.toLocaleString("ko-KR")}개`}
              onClick={() => setVote(vote === "down" ? null : "down")}
            />
            <Text aria-hidden="true">{down.toLocaleString("ko-KR")}</Text>
          </Inline>
        </Stack>
      </section>

      <section aria-labelledby="gdd-comments">
        <Stack gap={16}>
          <Inline justify="space-between" gap={12}>
            <Heading id="gdd-comments">댓글 {comments.length}개</Heading>
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
          </Inline>

          <Form
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
            <Inline justify="end">
              <Button type="submit" size="md">
                등록
              </Button>
            </Inline>
          </Form>

          {comments.length === 0 ? (
            <Empty>
              <h3>아직 댓글이 없습니다</h3>
              <p>첫 번째로 플레이 후기를 남겨 보세요.</p>
            </Empty>
          ) : (
            // 댓글 컴포넌트(6단계)가 없어 List로 만듭니다. 본문 자리가 Title·Description뿐입니다(2차 2-L3).
            <List.Root>
              {visible.map((comment) => {
                const isLiked = liked.includes(comment.id);
                const count = comment.likes + (isLiked ? 1 : 0);
                return (
                  <List.Item key={comment.id}>
                    <List.Content
                      leading={
                        <Avatar.Root>
                          <Avatar.Fallback>
                            {comment.author.slice(0, 1)}
                          </Avatar.Fallback>
                        </Avatar.Root>
                      }
                      trailing={
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
                      }
                    >
                      <List.Title>{comment.author}</List.Title>
                      <List.Description>
                        <time dateTime={comment.date}>
                          {formatDate(comment.date)}
                        </time>
                      </List.Description>
                      <List.Description>{comment.text}</List.Description>
                      <Inline gap={4}>
                        <IconButton
                          icon={<ThumbsUp />}
                          size="sm"
                          variant="utility"
                          selected={isLiked}
                          aria-pressed={isLiked}
                          aria-label={`도움이 돼요 ${count}명`}
                          onClick={() =>
                            setLiked((list) =>
                              isLiked
                                ? list.filter((id) => id !== comment.id)
                                : [...list, comment.id],
                            )
                          }
                        />
                        <List.Description aria-hidden="true">
                          {count}
                        </List.Description>
                      </Inline>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List.Root>
          )}
          {!showAll && comments.length > 3 && (
            <Inline justify="center">
              <Button
                size="md"
                variant="standard"
                onClick={() => setShowAll(true)}
              >
                댓글 {comments.length - 3}개 더 보기
              </Button>
            </Inline>
          )}
        </Stack>
      </section>
    </Stack>
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
      {/* 화면 폭과 바깥 여백은 앱 레이아웃의 몫이라 예제에서만 정합니다. */}
      <div
        style={{ maxWidth: 1040, marginInline: "auto", padding: "24px 16px" }}
      >
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
