"use client";
import { useState } from "react";
import {
  Minus,
  Play,
  Plus,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "../src/components/ui/button";
import { Badge } from "../src/components/ui/badge";
import { Toggle } from "../src/components/ui/toggle";
import { Skeleton } from "../src/components/ui/skeleton";
import { Toast } from "../src/components/ui/toast";
import "./game-discovery.css";

// 대표 화면 5번 게임 탐색입니다.
// 구성은 대표 화면 명세(히어로 배너 → 인기 게임 → 실시간 차트)를 따르고, 참고 제품에서는 여백·글자·톤만 가져옵니다.
// 화면 배치는 game-discovery.css에 토큰으로만 적습니다.

/** 예제용 게임 그림입니다. 하늘·섬·캐릭터를 그립니다. */
function art(
  hue: number,
  { ratio = "wide" }: { ratio?: "wide" | "square" } = {},
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
</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

type Game = {
  id: string;
  title: string;
  creator: string;
  genre: string;
  like: number;
  playing: string;
  hue: number;
  change: number;
  tag?: string;
};

const genres = [
  "전체",
  "어드벤처",
  "롤플레이",
  "시뮬레이션",
  "장애물",
  "공포",
  "격투",
  "두뇌",
];
const charts = ["급상승", "추천 상위", "최고 수익"];

const base: Game[] = [
  {
    id: "g1",
    title: "하늘섬 탐험",
    creator: "하늘공방 스튜디오",
    genre: "어드벤처",
    like: 94,
    playing: "3.2만",
    hue: 205,
    change: 2,
    tag: "업데이트",
  },
  {
    id: "g2",
    title: "우리 동네 카페",
    creator: "포근한하루",
    genre: "롤플레이",
    like: 89,
    playing: "1.8만",
    hue: 25,
    change: -1,
  },
  {
    id: "g3",
    title: "도시 건설왕",
    creator: "블록 시티",
    genre: "시뮬레이션",
    like: 91,
    playing: "1.1만",
    hue: 140,
    change: 0,
  },
  {
    id: "g4",
    title: "무지개 장애물",
    creator: "점프점프",
    genre: "장애물",
    like: 86,
    playing: "9,400",
    hue: 290,
    change: 5,
    tag: "신작",
  },
  {
    id: "g5",
    title: "폐교의 밤",
    creator: "달빛공방",
    genre: "공포",
    like: 82,
    playing: "7,100",
    hue: 320,
    change: -3,
  },
  {
    id: "g6",
    title: "바다 낚시 대회",
    creator: "파도소리",
    genre: "시뮬레이션",
    like: 90,
    playing: "5,600",
    hue: 180,
    change: 1,
  },
  {
    id: "g7",
    title: "고양이 마을",
    creator: "냥냥 스튜디오",
    genre: "롤플레이",
    like: 93,
    playing: "4,800",
    hue: 45,
    change: 4,
  },
  {
    id: "g8",
    title: "우주 정거장 생존기",
    creator: "별빛 게임즈",
    genre: "어드벤처",
    like: 88,
    playing: "4,200",
    hue: 250,
    change: 0,
  },
  {
    id: "g9",
    title: "블록 쌓기 챔피언",
    creator: "쌓자쌓자",
    genre: "두뇌",
    like: 84,
    playing: "3,900",
    hue: 100,
    change: -2,
  },
  {
    id: "g10",
    title: "검과 방패 아레나",
    creator: "강철기사단",
    genre: "격투",
    like: 87,
    playing: "3,100",
    hue: 15,
    change: 6,
    tag: "이벤트",
  },
  {
    id: "g11",
    title: "비밀의 숲 미로",
    creator: "숲지기",
    genre: "두뇌",
    like: 85,
    playing: "2,700",
    hue: 160,
    change: 1,
  },
  {
    id: "g12",
    title: "구름 카페 타이쿤",
    creator: "하늘공방 스튜디오",
    genre: "시뮬레이션",
    like: 92,
    playing: "2,400",
    hue: 330,
    change: 3,
  },
];

const longGames: Game[] = base.map((game, index) => ({
  ...game,
  title:
    index % 2 === 0
      ? `${game.title}: 끝없이 이어지는 구름 너머 비밀의 왕국을 찾아 떠나는 여름방학 대모험 시즌 2`
      : `${game.title}리마스터에디션한정판이벤트진행중`,
}));

const banners = [
  {
    id: "b1",
    label: "이번 주 추천",
    title: "하늘 고래 레이드 주간",
    body: "친구 12명과 함께 하늘 고래를 잡고 한정 꼬리 장식을 받아 가세요. 11월 7일까지.",
    hue: 205,
  },
  {
    id: "b2",
    label: "신작",
    title: "무지개 장애물 시즌 2",
    body: "새 코스 30개와 바뀐 체크포인트. 지금 가장 빠르게 오르는 장애물 게임이에요.",
    hue: 290,
  },
  {
    id: "b3",
    label: "이벤트",
    title: "가을 축제 한마당",
    body: "참여 게임 8곳에서 축제 아이템을 모아 아바타를 꾸며 보세요.",
    hue: 25,
  },
];

export type GameDiscoveryState = "default" | "loading" | "empty" | "error";

/** 탐색 카드는 그림·제목·추천·접속자만 보여 줍니다. 제작자는 탐색에서 고르는 기준이 아니라 기본으로 끄고, 필요한 화면에서만 켭니다. */
function Tile({
  game,
  showCreator = false,
}: {
  game: Game;
  showCreator?: boolean;
}) {
  return (
    <li className="gdv-tile">
      <div className="gdv-tile-media">
        <img src={art(game.hue, { ratio: "square" })} alt="" />
        {game.tag && (
          <Badge className="gdv-badge" variant="emphasis" size="xs">
            {game.tag}
          </Badge>
        )}
      </div>
      <div className="gdv-tile-copy">
        <a className="gdv-title" href={`#game-${game.id}`}>
          {game.title}
        </a>
        {showCreator && <span className="gdv-meta">{game.creator}</span>}
        <Stats game={game} />
      </div>
    </li>
  );
}

/** 추천과 접속자는 격자·차트 모두 같은 모양(아이콘 + 숫자)으로 두고, 뜻은 숨긴 글자로 읽게 합니다. */
function Stats({ game }: { game: Game }) {
  return (
    <span className="gdv-meta-row">
      <span className="gdv-stat">
        <ThumbsUp size={14} aria-hidden="true" />
        <span className="gdv-sr">추천 </span>
        {game.like}%
      </span>
      <span className="gdv-stat">
        <Users size={14} aria-hidden="true" />
        {game.playing}
        <span className="gdv-sr">명 플레이 중</span>
      </span>
    </span>
  );
}

function Rank({
  game,
  place,
  showCreator = false,
}: {
  game: Game;
  place: number;
  showCreator?: boolean;
}) {
  const dir = game.change > 0 ? "up" : game.change < 0 ? "down" : "same";
  const Arrow =
    dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  return (
    <li className="gdv-rank">
      <span className="gdv-rank-number" aria-hidden="true">
        {place}
      </span>
      <img src={art(game.hue, { ratio: "square" })} alt="" />
      <span className="gdv-rank-copy">
        <a className="gdv-title" href={`#game-${game.id}`}>
          {game.title}
        </a>
        {showCreator && <span className="gdv-meta">{game.creator}</span>}
        <Stats game={game} />
      </span>
      {/* 변화는 화살표와 숫자로 보이고, 뜻은 숨긴 글자로 읽습니다. 변화가 없으면 숫자 없이 줄표 아이콘만 둡니다. */}
      <span className="gdv-change" data-dir={dir}>
        <Arrow size={14} aria-hidden="true" />
        <span aria-hidden="true">
          {dir !== "same" && Math.abs(game.change)}
        </span>
        <span className="gdv-sr">
          {dir === "same"
            ? "순위 변화 없음"
            : `어제보다 ${Math.abs(game.change)}계단 ${dir === "up" ? "상승" : "하락"}`}
        </span>
      </span>
    </li>
  );
}

function Discovery({
  state,
  longText,
}: {
  state: GameDiscoveryState;
  longText: boolean;
}) {
  const toast = Toast.useToastManager();
  const [status, setStatus] = useState(state);
  const [genre, setGenre] = useState("전체");
  const [chart, setChart] = useState("급상승");
  const [banner, setBanner] = useState(0);
  const games = status === "empty" ? [] : longText ? longGames : base;
  const filtered = games.filter(
    (game) => genre === "전체" || game.genre === genre,
  );
  // 장르는 "장르별 게임" 구역만 거릅니다. 배너·인기 게임·실시간 차트는 전체 게임 기준입니다.
  // 인기 게임은 지금 접속자가 많은 순(예제 데이터 순서)이고, 차트는 다른 기준으로만 줄 세워 두 구역이 같은 목록이 되지 않게 합니다.
  const popular = games.slice(0, 6);
  const ranked = [...games]
    .sort((a, b) =>
      chart === "급상승"
        ? b.change - a.change
        : chart === "추천 상위"
          ? b.like - a.like
          : a.hue - b.hue,
    )
    .slice(0, 10);

  function retry() {
    setStatus("loading");
    setTimeout(() => setStatus("default"), 800);
  }

  const loading = status === "loading";
  const current = banners[banner];

  return (
    <div className="gdv-page">
      <h1 className="gdv-h1">게임 탐색</h1>

      {status === "error" ? (
        // Alert는 제목이 h3로 고정되고 상자가 둘러져 페이지 상태로 쓰기 어렵습니다(3.5단계 N7·N8).
        <div className="gdv-state" role="alert">
          <h2>게임 목록을 불러오지 못했습니다</h2>
          <p>네트워크 연결을 확인한 뒤 다시 시도해 주세요.</p>
          <Button size="sm" variant="standard" onClick={retry}>
            다시 시도
          </Button>
        </div>
      ) : status === "empty" ? (
        <div className="gdv-state">
          <h2>아직 공개된 게임이 없습니다</h2>
          <p>새 게임이 올라오면 여기에 보여 드릴게요.</p>
          <Button size="sm" variant="standard" onClick={retry}>
            새로 고침
          </Button>
        </div>
      ) : loading ? (
        <>
          <Skeleton style={{ height: 320, borderRadius: 16 }} />
          <div className="gdv-grid">
            {Array.from({ length: 12 }, (_, key) => (
              <div className="gdv-tile" key={key}>
                <Skeleton style={{ aspectRatio: "1", borderRadius: 12 }} />
                <Skeleton style={{ height: 16, width: "85%" }} />
                <Skeleton style={{ height: 12, width: "55%" }} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <section
            className="gdv-hero"
            aria-labelledby="gdv-banner"
            aria-roledescription="배너"
          >
            <img src={art(current.hue)} alt="" />
            <p className="gdv-hero-label">
              <Badge variant="over-media" size="xs">
                {current.label}
              </Badge>
            </p>
            <h2 id="gdv-banner">{current.title}</h2>
            <p>{current.body}</p>
            <div className="gdv-hero-actions">
              {/* 플레이는 채운 재생 아이콘만으로 뜻이 통해 글자를 두지 않습니다. 이름은 aria-label로 줍니다. */}
              <Button
                className="gdv-play"
                size="lg"
                aria-label="바로 플레이"
                onClick={() =>
                  toast.add({ title: `${current.title}을(를) 엽니다` })
                }
              >
                <Play size={24} fill="currentColor" aria-hidden="true" />
              </Button>
              {/* 같은 줄의 작업 버튼은 중요도를 색으로 나누고 크기는 같게 둡니다. */}
              <Button size="lg" variant="over-media">
                자세히 보기
              </Button>
            </div>
            <div className="gdv-hero-dots">
              {banners.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={index === banner}
                  aria-label={`${index + 1}번째 배너: ${item.title}`}
                  onClick={() => setBanner(index)}
                />
              ))}
            </div>
          </section>

          <section className="gdv-shelf" aria-labelledby="gdv-popular">
            <div className="gdv-shelf-head">
              <h2 id="gdv-popular" className="gdv-h2">
                지금 인기 있는 게임
              </h2>
            </div>
            {/* 장르별 구역과 겹치지 않게 지금 많이 하는 게임 한 줄만 보여 줍니다. */}
            <ul className="gdv-grid" data-layout="row">
              {popular.map((game) => (
                <Tile key={game.id} game={game} />
              ))}
            </ul>
          </section>

          <section className="gdv-shelf" aria-labelledby="gdv-chart">
            <div className="gdv-shelf-head">
              <div>
                <h2 id="gdv-chart" className="gdv-h2">
                  실시간 차트
                </h2>
                <p>10분마다 새로 계산해요. 오늘 오후 3시 기준.</p>
              </div>
            </div>
            <div className="gdv-chips" role="group" aria-label="차트 종류">
              {charts.map((name) => (
                <Toggle
                  key={name}
                  pressed={chart === name}
                  onPressedChange={() => setChart(name)}
                >
                  {name}
                </Toggle>
              ))}
            </div>
            <ol className="gdv-ranks">
              {ranked.map((game, index) => (
                <Rank key={game.id} game={game} place={index + 1} />
              ))}
            </ol>
          </section>

          {/* 장르는 이 구역만 거릅니다. 구역 제목 아래에 두어 거르는 범위를 분명히 합니다. */}
          <section className="gdv-shelf" aria-labelledby="gdv-genre">
            <div className="gdv-shelf-head">
              <h2 id="gdv-genre" className="gdv-h2">
                장르별 게임
              </h2>
            </div>
            <div className="gdv-chips" role="group" aria-label="장르">
              {genres.map((name) => (
                <Toggle
                  key={name}
                  pressed={genre === name}
                  onPressedChange={() => setGenre(name)}
                >
                  {name}
                </Toggle>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div className="gdv-state">
                <h3>{genre} 게임이 아직 없습니다</h3>
                <p>다른 장르를 골라 보세요.</p>
                <Button
                  size="md"
                  variant="standard"
                  onClick={() => setGenre("전체")}
                >
                  모든 장르 보기
                </Button>
              </div>
            ) : (
              <ul className="gdv-grid">
                {filtered.map((game) => (
                  <Tile key={game.id} game={game} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
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
  return (
    <Toast.Provider>
      <div className="gdv">
        <Discovery
          key={`${state}-${longText}`}
          state={state}
          longText={longText}
        />
      </div>
      <Toast.Toaster />
    </Toast.Provider>
  );
}
