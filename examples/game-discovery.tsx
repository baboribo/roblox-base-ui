"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardImage,
  CardMedia,
  CardMeta,
  CardTitle,
} from "../src/components/ui/card";
import { Carousel } from "../src/components/ui/carousel";
import { List } from "../src/components/ui/list";
import { Badge } from "../src/components/ui/badge";
import { Button } from "../src/components/ui/button";
import { Empty } from "../src/components/ui/empty";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { Toggle } from "../src/components/ui/toggle";
import { ToggleGroup } from "../src/components/ui/toggle-group";
import { Heading, Text } from "../src/components/ui/typography";
import { Input } from "../src/components/ui/input";
import "./game-discovery.css";

// 2단계 점검용 조합입니다. 기존 컴포넌트만 사용하고, 빠진 부분은 화면 CSS로만 채웁니다.
// 화면 CSS로 채운 곳은 docs/engineering/GAME-DISCOVERY-AUDIT.md에 문제로 기록했습니다.

type Game = {
  id: string;
  title: string;
  genre: string;
  likeRatio: number;
  playing: string;
  change: number;
  hue: number;
};

function thumbnail(hue: number, label: string) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="hsl(${hue} 55% 62%)"/><path d="m0 150 90-70 70 50 70-90 90 110v30H0z" fill="hsl(${hue} 45% 38%)"/><text x="16" y="34" font-family="sans-serif" font-size="20" fill="#fff">${label}</text></svg>`,
    )
  );
}

const genres = ["전체", "어드벤처", "롤플레이", "시뮬레이션", "장애물", "공포"];

const shortGames: Game[] = [
  {
    id: "g1",
    title: "하늘섬 탐험",
    genre: "어드벤처",
    likeRatio: 94,
    playing: "3.2만",
    change: 2,
    hue: 205,
  },
  {
    id: "g2",
    title: "우리 동네 카페",
    genre: "롤플레이",
    likeRatio: 89,
    playing: "1.8만",
    change: 0,
    hue: 25,
  },
  {
    id: "g3",
    title: "도시 건설왕",
    genre: "시뮬레이션",
    likeRatio: 91,
    playing: "1.1만",
    change: -1,
    hue: 140,
  },
  {
    id: "g4",
    title: "무지개 장애물",
    genre: "장애물",
    likeRatio: 86,
    playing: "9,400",
    change: 5,
    hue: 290,
  },
  {
    id: "g5",
    title: "폐교의 밤",
    genre: "공포",
    likeRatio: 82,
    playing: "7,100",
    change: -3,
    hue: 0,
  },
  {
    id: "g6",
    title: "바다 낚시 대회",
    genre: "시뮬레이션",
    likeRatio: 90,
    playing: "5,600",
    change: 1,
    hue: 180,
  },
];

// 긴 한국어 조건: 띄어쓰기 없는 긴 단어와 여러 줄로 넘어가는 제목을 함께 확인합니다.
const longGames: Game[] = shortGames.map((game, index) => ({
  ...game,
  title:
    index % 2 === 0
      ? `${game.title}: 끝없이 이어지는 구름 너머 비밀의 왕국을 찾아 떠나는 여름방학 대모험 시즌 2`
      : `${game.title}리마스터에디션한정판이벤트진행중`,
}));

export type GameDiscoveryState = "default" | "loading" | "empty" | "error";

export function GameDiscoveryExample({
  state = "default",
  longText = false,
}: {
  /** 화면의 데이터 상태입니다. @defaultValue "default" */
  state?: GameDiscoveryState;
  /** 긴 한국어 제목으로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
}) {
  const [genre, setGenre] = useState("전체");
  const [opened, setOpened] = useState("");
  const games = longText ? longGames : shortGames;
  const filtered =
    state === "empty"
      ? []
      : games.filter((game) => genre === "전체" || game.genre === genre);
  const hero = games[0];
  const chart = [...filtered].sort((a, b) => b.likeRatio - a.likeRatio);

  return (
    <div className="gd-page">
      <header className="gd-header">
        <Heading>게임 탐색</Heading>
        <Input
          type="search"
          aria-label="게임 검색"
          placeholder="게임 이름으로 검색"
          controlSize="md"
        />
      </header>

      <section className="gd-hero" aria-labelledby="gd-hero-title">
        {state === "loading" ? (
          <Skeleton className="gd-hero-skeleton" />
        ) : (
          <Card variant="plain" className="gd-hero-card">
            <CardMedia ratio="wide">
              <CardImage src={thumbnail(hero.hue, "")} alt="" />
            </CardMedia>
            <div className="gd-hero-overlay">
              <Badge variant="over-media">이번 주 추천</Badge>
              <CardTitle as="h2" id="gd-hero-title">
                {hero.title}
              </CardTitle>
              <CardMeta>
                좋아요 {hero.likeRatio}% · {hero.playing}명 플레이 중
              </CardMeta>
              <Button variant="over-media" size="md">
                바로 플레이
              </Button>
            </div>
          </Card>
        )}
      </section>

      <ToggleGroup
        aria-label="장르"
        value={[genre]}
        onValueChange={(value) => value[0] && setGenre(value[0])}
        className="gd-genres"
      >
        {genres.map((name) => (
          <Toggle key={name} value={name}>
            {name}
          </Toggle>
        ))}
      </ToggleGroup>

      {state === "error" ? (
        <Alert>
          <AlertTitle>게임 목록을 불러오지 못했습니다</AlertTitle>
          <AlertDescription>
            네트워크 연결을 확인한 뒤 다시 시도해 주세요.
          </AlertDescription>
          <Button size="sm" variant="standard" className="gd-retry">
            다시 시도
          </Button>
        </Alert>
      ) : (
        <>
          <section className="gd-section" aria-labelledby="gd-popular">
            <h2 id="gd-popular" className="gd-section-title">
              인기 게임
            </h2>
            {state === "loading" ? (
              <div className="gd-row-skeleton">
                {[0, 1, 2].map((key) => (
                  <Skeleton key={key} className="gd-card-skeleton" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Empty>
                <h3>이 장르의 게임이 아직 없습니다</h3>
                <p>다른 장르를 선택하거나 전체 목록을 확인해 보세요.</p>
                <Button
                  size="sm"
                  variant="standard"
                  onClick={() => setGenre("전체")}
                >
                  전체 보기
                </Button>
              </Empty>
            ) : (
              <Carousel
                label="인기 게임"
                items={filtered.map((game) => ({
                  id: game.id,
                  title: game.title,
                  description: `좋아요 ${game.likeRatio}% · ${game.playing}명`,
                  media: (
                    <img
                      className="gd-carousel-image"
                      src={thumbnail(game.hue, "")}
                      alt=""
                    />
                  ),
                }))}
                onItemClick={setOpened}
              />
            )}
          </section>

          <section className="gd-section" aria-labelledby="gd-chart">
            <h2 id="gd-chart" className="gd-section-title">
              실시간 차트
            </h2>
            {state === "loading" ? (
              <div className="gd-list-skeleton">
                {[0, 1, 2, 3].map((key) => (
                  <Skeleton key={key} className="gd-row-skeleton-item" />
                ))}
              </div>
            ) : chart.length === 0 ? (
              <Text>표시할 순위가 없습니다.</Text>
            ) : (
              <List.Root variant="boxed">
                {chart.map((game, index) => (
                  <List.Item key={game.id}>
                    <List.Action onClick={() => setOpened(game.id)}>
                      <List.Content
                        leading={
                          <span className="gd-rank">
                            <strong>{index + 1}</strong>
                            <img
                              className="gd-rank-thumb"
                              src={thumbnail(game.hue, "")}
                              alt=""
                            />
                          </span>
                        }
                        trailing={
                          <Badge
                            size="xs"
                            variant={
                              game.change > 0
                                ? "success"
                                : game.change < 0
                                  ? "alert"
                                  : "standard"
                            }
                          >
                            {game.change > 0
                              ? `▲ ${game.change}`
                              : game.change < 0
                                ? `▼ ${-game.change}`
                                : "-"}
                          </Badge>
                        }
                      >
                        <List.Title>{game.title}</List.Title>
                        <List.Description>
                          {game.genre} · 좋아요 {game.likeRatio}% ·{" "}
                          {game.playing}명
                        </List.Description>
                      </List.Content>
                    </List.Action>
                  </List.Item>
                ))}
              </List.Root>
            )}
          </section>
        </>
      )}
      {opened && <p role="status">선택한 게임: {opened}</p>}
    </div>
  );
}
