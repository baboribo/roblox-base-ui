"use client";
import { SwitchExample } from "./switch";
import { StatusMeterExample } from "./status-meter";
import { CarouselExample } from "./carousel";
import { AccordionExample } from "./accordion";
import { useState } from "react";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import { Select } from "../src/components/ui/select";
import { Dialog } from "../src/components/ui/dialog";
import { Radio } from "../src/components/ui/radio";
import { RadioGroup } from "../src/components/ui/radio-group";
import { Icon } from "../src/components/ui/icon";
import { ChatDock, ChatGroupPanel } from "../src/components/ui/chat";
import { ListExample } from "./list";
import { conversations, people } from "./chat";
import "./settings.css";

export function SettingsExample() {
  const [preference, setPreference] = useState("System");
  const [group, setGroup] = useState(true);
  const [name, setName] = useState("Builder");
  const [savedName, setSavedName] = useState("Builder");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  return (
    <>
      <div className="default-layout">
        <div className="default-settings">
          <section className="default-section">
            <h2>브라우저 설정</h2>
            <h3>테마</h3>
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
            <Select
              label="표시 모드"
              options={["System", "Light", "Dark"].map((value) => ({
                value,
                label: value,
              }))}
              value={preference}
              onValueChange={(value) => value && setPreference(value)}
            />
            <p className="default-help">선택값은 예제 안에서만 유지됩니다.</p>
          </section>
          <section className="default-section">
            <h2>계정 정보</h2>
            <div className="default-info-row">
              <div>
                <h3>표시 이름</h3>
                <span>{savedName}</span>
              </div>
              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger
                  render={<Button size="md" variant="standard" />}
                >
                  이름 변경
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Backdrop />
                  <Dialog.Popup size={size}>
                    <Dialog.CloseAffordance />
                    <Dialog.Body>
                      <Dialog.Title>표시 이름 변경</Dialog.Title>
                      <Dialog.Description>
                        다른 사용자에게 표시할 이름을 입력하세요.
                      </Dialog.Description>
                      <div className="space-top">
                        <Input
                          controlSize="md"
                          aria-label="표시 이름"
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
                        저장
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Popup>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
            <div className="demo-row default-size-picker">
              <span>대화상자 크기</span>
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
            <h3>서버 설정</h3>
            <div style={{ marginBottom: 24 }}>
              <SwitchExample />
            </div>
            <h3>공개 범위</h3>
            <RadioGroup
              defaultValue="connections"
              aria-label="프로필 공개 범위"
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
            <h2>접속 기기</h2>
            <ListExample />
          </section>
          <section className="default-section">
            <h2>자주 묻는 질문</h2>
            <AccordionExample />
          </section>
        </div>
        <aside className="default-chat-study" aria-label="채팅 예제">
          <div className="default-study-caption">
            <h2>채팅</h2>
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
        </aside>
      </div>
      <section className="default-resources">
        <h2>상태와 목록</h2>
        <StatusMeterExample />
        <CarouselExample />
      </section>
    </>
  );
}
