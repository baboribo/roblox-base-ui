import { SwitchExample } from "../examples/forms";
import { StatusMeterExample, CarouselExample } from "../examples/default-web";
import { AccordionExample } from "../examples/navigation";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Dialog } from "../../components/ui/dialog";
import { Radio } from "../../components/ui/radio";
import { RadioGroup } from "../../components/ui/radio-group";
import { Icon } from "../../components/ui/icon";
import { ChatDock, ChatGroupPanel } from "../../components/ui/chat";
import { ListExample, conversations, people } from "../examples/default-web";
import "./default-web.css";

export function DefaultWebPage() {
  const [preference, setPreference] = useState("System");
  const [group, setGroup] = useState(true);
  const [name, setName] = useState("Builder");
  const [savedName, setSavedName] = useState("Builder");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">DEFAULT WEB · LIVE CSS STUDY</span>
        <h1>같은 규칙, 더 가까운 UI.</h1>
        <p>
          실제 화면에서 확인한 Default 테마. 설정과 Chat은 가상 데이터로
          작동합니다.
        </p>
      </div>
      <div className="default-layout">
        <div className="default-settings">
          <section className="default-section">
            <h2>Browser preferences</h2>
            <h3>Theme</h3>
            <div className="default-theme-card">
              <div className="default-theme-mini">
                <div />
                <div />
                <div />
              </div>
              <strong>Default</strong>
              <span className="default-selected">
                <Icon name="icon-filled-check" size={16} />
              </span>
            </div>
            <label id="appearance-label" className="default-field-label">
              Appearance
            </label>
            <Select.Root
              items={{ System: "System", Light: "Light", Dark: "Dark" }}
              value={preference}
              onValueChange={(value) => value && setPreference(value)}
            >
              <Select.Trigger aria-labelledby="appearance-label">
                <Select.Value />
                <Select.Icon>
                  <Icon name="icon-regular-chevron-large-down" size={20} />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner>
                  <Select.Popup>
                    {["System", "Light", "Dark"].map((value) => (
                      <Select.Item key={value} value={value}>
                        <Select.ItemText>{value}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
            <p className="default-help">
              이 선택은 예제 상태만 바꿉니다. 미리보기 색상은 상단 해·달
              버튼으로 전환합니다.
            </p>
          </section>
          <section className="default-section">
            <h2>Account info</h2>
            <div className="default-info-row">
              <div>
                <h3>Display name</h3>
                <span>{savedName}</span>
              </div>
              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger
                  render={<Button size="md" variant="standard" />}
                >
                  Change Name
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Backdrop />
                  <Dialog.Popup size={size}>
                    <Dialog.CloseAffordance />
                    <Dialog.Body>
                      <Dialog.Title>Change Display Name</Dialog.Title>
                      <Dialog.Description>
                        Your display name is how you appear to others.
                      </Dialog.Description>
                      <div className="space-top">
                        <Input
                          controlSize="md"
                          aria-label="Display name"
                          value={name}
                          onValueChange={setName}
                          trailing={
                            <span className="rbx-chat-count">
                              {name.length}/20
                            </span>
                          }
                          maxLength={20}
                        />
                      </div>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Button
                        size="md"
                        style={{ width: "100%" }}
                        onClick={() => {
                          setSavedName(name);
                          setOpen(false);
                        }}
                      >
                        Save
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Popup>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
            <div className="demo-row default-size-picker">
              <span>Dialog size</span>
              {(["sm", "md", "lg"] as const).map((value) => (
                <Button
                  key={value}
                  size="xs"
                  variant={size === value ? "emphasis" : "utility"}
                  onClick={() => setSize(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
            <h3>Server preferences</h3>
            <div style={{ marginBottom: 24 }}>
              <SwitchExample />
            </div>
            <h3>Visibility</h3>
            <RadioGroup
              defaultValue="connections"
              aria-label="Profile visibility"
            >
              {["everyone", "connections", "no-one"].map((value) => (
                <label className="demo-row default-radio-label" key={value}>
                  <Radio.Root value={value}>
                    <Radio.Indicator />
                  </Radio.Root>
                  {value === "everyone"
                    ? "Everyone"
                    : value === "connections"
                      ? "Connections"
                      : "No one"}
                </label>
              ))}
            </RadioGroup>
          </section>
          <section className="default-section">
            <h2>Session list</h2>
            <ListExample />
          </section>
          <section className="default-section">
            <h2>Frequently asked questions</h2>
            <AccordionExample />
            <p className="default-help">
              Robux FAQ에서 확인한 행과 답변 규칙. 내용은 키트 사용법으로
              바꿨습니다.
            </p>
          </section>
        </div>
        <aside className="default-chat-study" aria-label="Chat 디자인 비교">
          <div className="default-study-caption">
            <h2>Chat</h2>
            <span>286 × 360 / 260 × 360</span>
          </div>
          <div className="default-chat-panels">
            <ChatDock
              conversations={conversations}
              onNewGroup={() => setGroup(true)}
            />
            {group && (
              <ChatGroupPanel people={people} onClose={() => setGroup(false)} />
            )}
          </div>
          <p className="default-help">
            헤더 48px · 검색 32px · 상단 모서리 16px. 그룹 생성 콜백은 연결하지
            않았습니다.
          </p>
        </aside>
      </div>
      <section className="default-resources">
        <h2>Account Status patterns</h2>
        <StatusMeterExample />
        <CarouselExample />
      </section>
      <div className="default-spec-strip">
        {[
          ["BUTTON", "24 / 32 / 40 / 48"],
          ["RADIUS", "4 / 8 / 16"],
          ["FONT", "Builder Sans"],
          ["SOURCE", "Foundation Web"],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </>
  );
}
