"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardImage,
  CardLink,
  CardMedia,
  CardMeta,
  CardTitle,
} from "../src/components/ui/card";
import { Badge } from "../src/components/ui/badge";
import { Button } from "../src/components/ui/button";
import { Toggle } from "../src/components/ui/toggle";
import { Empty } from "../src/components/ui/empty";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../src/components/ui/alert";
import { Grid, Inline, Stack } from "../src/components/ui/layout";
import { Heading } from "../src/components/ui/typography";

// 대표 화면 5번 게임 탐색입니다. 라이브러리 컴포넌트와 배치 컴포넌트만으로 조립합니다.
// 화면 CSS 파일은 두지 않고, 라이브러리에 없어 생긴 한계는 docs/engineering/GAME-DISCOVERY-AUDIT.md에 기록합니다.

type Game = {
  id: string;
  title: string;
  genre: string;
  likeRatio: number;
  playing: string;
  hue: number;
};

function thumbnail(hue: number) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="hsl(${hue} 55% 62%)"/><path d="m0 150 90-70 70 50 70-90 90 110v30H0z" fill="hsl(${hue} 45% 38%)"/></svg>`,
    )
  );
}

const genres = ["전체", "어드벤처", "롤플레이", "시뮬레이션", "장애물", "공포"];
const charts = ["인기", "최고 수익", "급상승"];

const shortGames: Game[] = [
  ["g1", "하늘섬 탐험", "어드벤처", 94, "3.2만", 205],
  ["g2", "우리 동네 카페", "롤플레이", 89, "1.8만", 25],
  ["g3", "도시 건설왕", "시뮬레이션", 91, "1.1만", 140],
  ["g4", "무지개 장애물", "장애물", 86, "9,400", 290],
  ["g5", "폐교의 밤", "공포", 82, "7,100", 0],
  ["g6", "바다 낚시 대회", "시뮬레이션", 90, "5,600", 180],
  ["g7", "고양이 마을", "롤플레이", 93, "4,800", 45],
  ["g8", "우주 정거장 생존기", "어드벤처", 88, "4,200", 250],
  ["g9", "블록 쌓기 챔피언", "장애물", 84, "3,900", 320],
].map(([id, title, genre, likeRatio, playing, hue]) => ({
  id,
  title,
  genre,
  likeRatio,
  playing,
  hue,
})) as Game[];

// 긴 한국어 조건: 띄어쓰기 없는 긴 단어와 여러 줄로 넘어가는 제목을 함께 확인합니다.
const longGames: Game[] = shortGames.map((game, index) => ({
  ...game,
  title:
    index % 2 === 0
      ? `${game.title}: 끝없이 이어지는 구름 너머 비밀의 왕국을 찾아 떠나는 여름방학 대모험 시즌 2`
      : `${game.title}리마스터에디션한정판이벤트진행중`,
}));

export type GameDiscoveryState = "default" | "loading" | "empty" | "error";

/** 게임 카드 하나입니다. 제목 링크가 카드 전체를 덮어 상세 화면으로 이동합니다. */
function GameTile({ game }: { game: Game }) {
  return (
    <Card variant="plain">
      <CardMedia ratio="square">
        <CardImage src={thumbnail(game.hue)} alt="" />
      </CardMedia>
      <CardHeader>
        <CardTitle>
          <CardLink href={`#game-${game.id}`}>{game.title}</CardLink>
        </CardTitle>
        <CardMeta>
          좋아요 {game.likeRatio}% · {game.playing}명
        </CardMeta>
      </CardHeader>
    </Card>
  );
}

/** 하나만 고르는 필터 칩 줄입니다. 칩 컴포넌트가 없어 Toggle을 나란히 둡니다(1차 M8). */
function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Inline role="group" aria-label={label} gap={8}>
      {options.map((option) => (
        <Toggle
          key={option}
          pressed={value === option}
          onPressedChange={() => onChange(option)}
        >
          {option}
        </Toggle>
      ))}
    </Inline>
  );
}

function TileSkeletons({ count, min }: { count: number; min: string }) {
  return (
    <Grid minItemWidth={min} gap={16}>
      {Array.from({ length: count }, (_, key) => (
        <Stack key={key} gap={8}>
          <Skeleton style={{ aspectRatio: "1", borderRadius: 8 }} />
          <Skeleton style={{ height: 16, width: "80%" }} />
          <Skeleton style={{ height: 12, width: "60%" }} />
        </Stack>
      ))}
    </Grid>
  );
}

export function GameDiscoveryExample({
  state = "default",
  longText = false,
}: {
  /** 화면의 데이터 상태입니다. @defaultValue "default" */
  state?: GameDiscoveryState;
  /** 긴 한국어 제목으로 바꿔 줄바꿈을 확인합니다. @defaultValue false */
  longText?: boolean;
}) {
  const [status, setStatus] = useState(state);
  const [genre, setGenre] = useState("전체");
  const [chartType, setChartType] = useState("인기");
  const games = status === "empty" ? [] : longText ? longGames : shortGames;
  const filtered = games.filter(
    (game) => genre === "전체" || game.genre === genre,
  );
  // 예제 데이터라 차트 종류마다 정렬 기준만 바꿉니다.
  const chart = [...filtered].sort((a, b) =>
    chartType === "인기"
      ? b.likeRatio - a.likeRatio
      : chartType === "최고 수익"
        ? a.hue - b.hue
        : a.likeRatio - b.likeRatio,
  );

  function retry() {
    setStatus("loading");
    setTimeout(() => setStatus("default"), 800);
  }

  let content;
  if (status === "error") {
    content = (
      <Alert>
        <Stack gap={12} align="start">
          <div>
            <AlertTitle>게임 목록을 불러오지 못했습니다</AlertTitle>
            <AlertDescription>
              네트워크 연결을 확인한 뒤 다시 시도해 주세요.
            </AlertDescription>
          </div>
          <Button size="sm" variant="standard" onClick={retry}>
            다시 시도
          </Button>
        </Stack>
      </Alert>
    );
  } else if (status === "empty") {
    content = (
      <Empty>
        <h2>아직 공개된 게임이 없습니다</h2>
        <p>새 게임이 올라오면 여기에 보여 드릴게요.</p>
      </Empty>
    );
  } else {
    const loading = status === "loading";
    content = (
      <>
        <section aria-labelledby="gd-featured" aria-busy={loading}>
          <Stack gap={16}>
            <Heading id="gd-featured">이번 주 추천</Heading>
            {loading ? (
              <Grid minItemWidth="20rem" gap={24}>
                {[0, 1].map((key) => (
                  <Skeleton
                    key={key}
                    style={{ aspectRatio: "16 / 9", borderRadius: 8 }}
                  />
                ))}
              </Grid>
            ) : (
              <Grid minItemWidth="20rem" gap={24}>
                {games.slice(0, 2).map((game) => (
                  <Card key={game.id} variant="plain">
                    <CardMedia>
                      <CardImage src={thumbnail(game.hue)} alt="" />
                    </CardMedia>
                    <CardHeader>
                      <Badge variant="emphasis" size="xs">
                        {game.genre}
                      </Badge>
                      <CardTitle as="h3">
                        <CardLink href={`#game-${game.id}`}>
                          {game.title}
                        </CardLink>
                      </CardTitle>
                      <CardMeta>
                        좋아요 {game.likeRatio}% · {game.playing}명 플레이 중
                      </CardMeta>
                    </CardHeader>
                  </Card>
                ))}
              </Grid>
            )}
          </Stack>
        </section>

        <section aria-labelledby="gd-popular" aria-busy={loading}>
          <Stack gap={16}>
            <Heading id="gd-popular">인기 게임</Heading>
            <Chips
              label="장르"
              options={genres}
              value={genre}
              onChange={setGenre}
            />
            {loading ? (
              <TileSkeletons count={6} min="9rem" />
            ) : filtered.length === 0 ? (
              <Empty>
                <h3>{genre} 게임이 아직 없습니다</h3>
                <p>다른 장르를 골라 보세요.</p>
                <Button
                  size="sm"
                  variant="standard"
                  onClick={() => setGenre("전체")}
                >
                  모든 장르 보기
                </Button>
              </Empty>
            ) : (
              <Grid minItemWidth="9rem" gap={16}>
                {filtered.slice(0, 6).map((game) => (
                  <GameTile key={game.id} game={game} />
                ))}
              </Grid>
            )}
          </Stack>
        </section>

        <section aria-labelledby="gd-chart" aria-busy={loading}>
          <Stack gap={16}>
            <Heading id="gd-chart">실시간 차트</Heading>
            <Chips
              label="차트 종류"
              options={charts}
              value={chartType}
              onChange={setChartType}
            />
            {loading ? (
              <TileSkeletons count={6} min="18rem" />
            ) : chart.length === 0 ? (
              <Empty>
                <h3>{genre} 게임 순위가 아직 없습니다</h3>
                <p>위에서 다른 장르를 골라 보세요.</p>
              </Empty>
            ) : (
              // 순위는 순서가 의미라 ol이 맞지만 Grid는 div만 만듭니다(1차 M6).
              <Grid minItemWidth="18rem" gap={16}>
                {chart.map((game, index) => (
                  <Card
                    key={game.id}
                    variant="plain"
                    layout="horizontal"
                    density="compact"
                  >
                    <CardMedia ratio="square">
                      <CardImage src={thumbnail(game.hue)} alt="" />
                    </CardMedia>
                    <CardContent>
                      <CardMeta>{index + 1}위</CardMeta>
                      <CardTitle>
                        <CardLink href={`#game-${game.id}`}>
                          {game.title}
                        </CardLink>
                      </CardTitle>
                      <CardMeta>
                        {game.genre} · 좋아요 {game.likeRatio}%
                      </CardMeta>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            )}
          </Stack>
        </section>
      </>
    );
  }

  return (
    // 화면 폭과 바깥 여백은 앱 레이아웃의 몫이라 예제에서만 정합니다.
    <Stack
      gap={48}
      style={{ maxWidth: 1040, marginInline: "auto", padding: "24px 16px" }}
    >
      {content}
    </Stack>
  );
}
