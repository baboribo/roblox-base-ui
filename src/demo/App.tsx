import { useEffect, useState } from "react";
import { ArrowUpRight, Layers2, Moon, Menu, Sun } from "lucide-react";
import { catalog } from "./catalog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Sidebar } from "../components/ui/sidebar";
import { Icon, type IconName } from "../components/ui/icon";
import { Tabs } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { FoundationPage } from "./pages/Foundations";
import { InstallPage } from "./pages/Install";
import { SourcesPage } from "./pages/Sources";
import { DefaultWebPage } from "./pages/DefaultWeb";
import { RecipesPage } from "./pages/Recipes";
import { CopyButton, SourceBlock } from "./SourceBlock";
import { UsageGuide } from "./UsageGuide";
import "./app.css";

const files = import.meta.glob("../components/ui/*.{tsx,css}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const sections = [
  "default-web",
  "components",
  "foundations",
  "recipes",
  "install",
  "sources",
] as const;
type Section = (typeof sections)[number];
const labels: Record<Section, string> = {
  "default-web": "Default 웹",
  components: "컴포넌트",
  foundations: "디자인 토큰",
  recipes: "조합 예제",
  install: "설치와 수정",
  sources: "출처와 범위",
};

const sectionIcons: Record<Section, IconName> = {
  "default-web": "icon-regular-house",
  components: "icon-regular-backpack",
  foundations: "icon-regular-squares-grid-qr",
  recipes: "icon-regular-three-people",
  install: "icon-regular-gift-card",
  sources: "icon-regular-fountain-pen-nib",
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [section, setSection] = useState<Section>(() =>
    sections.includes(location.hash.slice(1) as Section)
      ? (location.hash.slice(1) as Section)
      : "default-web",
  );
  const [selected, setSelected] = useState("button");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const update = () => {
      const hash = location.hash.slice(1) as Section;
      if (sections.includes(hash)) {
        setSection(hash);
        setSidebarOpen(false);
      }
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const entry = catalog.find((item) => item.id === selected)!;
  const Example = entry.Example;
  const filtered = catalog.filter((item) =>
    `${item.name} ${item.group}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Sidebar.Provider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="app-shell">
        <a className="skip-link" href="#main-content">
          본문으로 건너뛰기
        </a>
        <header className="app-header">
          <div className="header-brand">
            <Sidebar.Trigger
              render={
                <Button size="sm" variant="utility" aria-label="탐색 열기" />
              }
            >
              <Menu size={20} />
            </Sidebar.Trigger>
            <a href="#components" className="wordmark">
              <Layers2 size={25} />
              <strong>
                BLOCK<span>/</span>UI
              </strong>
              <span className="wordmark-note">Roblox study kit</span>
            </a>
          </div>
          <div className="header-tools">
            <Button
              size="sm"
              variant="utility"
              aria-label={
                theme === "dark" ? "라이트 테마로 전환" : "다크 테마로 전환"
              }
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <span className="version">v0.4</span>
          </div>
        </header>
        <div className="workspace">
          <Sidebar.Panel
            className="library-sidebar"
            title="BLOCK/UI 탐색"
            closeLabel="탐색 닫기"
          >
            <Sidebar.Header>
              <div className="sidebar-caption">
                COMPONENT LIBRARY <span>{catalog.length}</span>
              </div>
              <Input
                controlSize="sm"
                value={query}
                onValueChange={setQuery}
                leading={<Icon name="icon-filled-magnifying-glass" size={16} />}
                placeholder="컴포넌트 검색…"
                aria-label="컴포넌트 검색"
              />
            </Sidebar.Header>
            <Sidebar.Content>
              <Sidebar.Group>
                <nav aria-label="주요 탐색">
                  <Sidebar.Menu>
                    {sections.map((item) => (
                      <Sidebar.Item key={item}>
                        <Sidebar.Link
                          href={`#${item}`}
                          icon={sectionIcons[item]}
                          active={section === item}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {labels[item]}
                        </Sidebar.Link>
                      </Sidebar.Item>
                    ))}
                  </Sidebar.Menu>
                </nav>
              </Sidebar.Group>
              <Sidebar.Group>
                <nav aria-label="컴포넌트 목록">
                  {[...new Set(filtered.map((item) => item.group))].map(
                    (group) => (
                      <Sidebar.Group key={group}>
                        <Sidebar.GroupLabel>{group}</Sidebar.GroupLabel>
                        <Sidebar.Menu>
                          {filtered
                            .filter((item) => item.group === group)
                            .map((item) => (
                              <Sidebar.Item key={item.id}>
                                <Sidebar.Action
                                  active={
                                    section === "components" &&
                                    selected === item.id
                                  }
                                  onClick={() => {
                                    setSelected(item.id);
                                    setSection("components");
                                    location.hash = "components";
                                    setSidebarOpen(false);
                                  }}
                                >
                                  {item.name}
                                </Sidebar.Action>
                              </Sidebar.Item>
                            ))}
                        </Sidebar.Menu>
                      </Sidebar.Group>
                    ),
                  )}
                  {!filtered.length && (
                    <p className="empty-search" role="status">
                      검색 결과가 없습니다.
                    </p>
                  )}
                </nav>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer>
              공개 토큰 · Base UI · 수정 가능한 소스
            </Sidebar.Footer>
          </Sidebar.Panel>
          <main id="main-content" tabIndex={-1}>
            <div className="context-bar">
              <span>
                라이브러리 <span className="slash">/</span>{" "}
                {section === "components" ? entry.name : labels[section]}
              </span>
              <span className="version">DEFAULT · {theme.toUpperCase()}</span>
            </div>
            {section === "components" ? (
              <>
                <div className="page-heading">
                  <span className="eyebrow">
                    {entry.group} <span className="tiny-divider">/</span>{" "}
                    {entry.primitive ? "BASE UI PRIMITIVE" : "HTML COMPOSITION"}
                  </span>
                  <h1>
                    {entry.name}
                    <span className="heading-dot">.</span>
                  </h1>
                  <p>{entry.description}</p>
                </div>
                <Tabs.Root key={selected} defaultValue="preview">
                  <Tabs.List aria-label="컴포넌트 보기">
                    <Tabs.Tab value="preview">미리보기</Tabs.Tab>
                    <Tabs.Tab value="source">소스 코드</Tabs.Tab>
                    <Tabs.Tab value="style">스타일</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="preview">
                    <div className="preview-panel">
                      <div className="preview-label">
                        <span>LIVE PREVIEW</span>
                        <span>{theme.toUpperCase()} · DEFAULT</span>
                      </div>
                      <div
                        className={`preview-content ${selected === "button" ? "wide" : ""}`}
                      >
                        <Example />
                      </div>
                      <div className="preview-bottom">
                        <span>직접 눌러보고, Tab 키로 이동해보세요.</span>
                        <Badge>
                          {entry.primitive ? "@base-ui/react" : "Semantic HTML"}
                        </Badge>
                      </div>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel value="source">
                    <SourceBlock
                      label={`components/ui/${selected}.tsx`}
                      code={files[`../components/ui/${selected}.tsx`]}
                    />
                  </Tabs.Panel>
                  <Tabs.Panel value="style">
                    <SourceBlock
                      label={`components/ui/${selected}.css`}
                      code={files[`../components/ui/${selected}.css`]}
                    />
                  </Tabs.Panel>
                </Tabs.Root>
                <div className="component-details">
                  <section>
                    <h2>내 프로젝트에 추가</h2>
                    <div className="install-line">
                      <code>npm run ui -- add {selected} --cwd ../my-app</code>
                      <CopyButton
                        text={`npm run ui -- add ${selected} --cwd ../my-app`}
                      />
                    </div>
                    <p>
                      이 키트 폴더에서 실행합니다. 공통 토큰과 필요한 파일을
                      함께 복사합니다.
                    </p>
                  </section>
                  <section className="anatomy">
                    <h2>코드 읽는 순서</h2>
                    <div>
                      <span>01</span>
                      <p>
                        <b>토큰</b>색상과 간격의 이름을 찾습니다.
                      </p>
                      <span>02</span>
                      <p>
                        <b>스타일</b>상태별 CSS를 확인합니다.
                      </p>
                      <span>03</span>
                      <p>
                        <b>컴포넌트</b>Base UI로 전달되는 props를 읽습니다.
                      </p>
                    </div>
                  </section>
                </div>
                <UsageGuide id={selected} />
              </>
            ) : section === "default-web" ? (
              <DefaultWebPage />
            ) : section === "foundations" ? (
              <FoundationPage />
            ) : section === "recipes" ? (
              <RecipesPage />
            ) : section === "install" ? (
              <InstallPage />
            ) : (
              <SourcesPage />
            )}
            <footer className="main-footer">
              <span>
                Independent study & implementation. Not affiliated with Roblox.
              </span>
              <a href="#sources">
                출처와 구현 범위 <ArrowUpRight size={13} />
              </a>
            </footer>
          </main>
        </div>
      </div>
    </Sidebar.Provider>
  );
}
