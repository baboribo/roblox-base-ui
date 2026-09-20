import { StrictMode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Dialog } from "../../../src/components/ui/dialog";
import { AlertDialog } from "../../../src/components/ui/alert-dialog";
import { Drawer } from "../../../src/components/ui/drawer";
import { Sidebar } from "../../../src/components/ui/sidebar";
import { Input } from "../../../src/components/ui/input";
import { Button } from "../../../src/components/ui/button";
import { Select } from "../../../src/components/ui/select";
import { Toast } from "../../../src/components/ui/toast";
import { Carousel } from "../../../src/components/ui/carousel";
import "../../../src/styles/theme.css";

const params = new URLSearchParams(location.search);
document.documentElement.dataset.theme = params.get("theme") ?? "light";
document.documentElement.dir = params.get("dir") ?? "ltr";
const long = "긴프로젝트이름과설정정보".repeat(16);
const choices = Array.from({ length: 30 }, (_, i) => ({
  value: String(i),
  label: `작업 공간 ${i + 1}`,
}));
function LongForm() {
  const [saved, setSaved] = useState("");
  const [open, setOpen] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>프로젝트 편집</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup
            size={(params.get("size") as "sm" | "md" | "lg") || "md"}
            initialFocus={title}
            aria-describedby={undefined}
          >
            <Dialog.CloseAffordance aria-label="편집 닫기" />
            <Dialog.Body>
              <Dialog.Title ref={title} tabIndex={-1}>
                {long}
              </Dialog.Title>
              <form
                id="project-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSaved(
                    String(new FormData(event.currentTarget).get("project")),
                  );
                  setOpen(false);
                }}
              >
                <label>
                  프로젝트 이름
                  <Input
                    name="project"
                    defaultValue="계속 보존할 이름"
                    required
                  />
                </label>
                <Select label="작업 공간" options={choices} defaultValue="0" />
                {Array.from({ length: 12 }, (_, i) => (
                  <p key={i}>
                    {i + 1}. {long}
                  </p>
                ))}
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close>취소</Dialog.Close>
              <Button type="submit" form="project-form">
                저장
              </Button>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <output>{saved}</output>
    </>
  );
}
function LongAlert() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>삭제 확인 열기</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Title>삭제 확인</AlertDialog.Title>
          <AlertDialog.Description>{long.repeat(4)}</AlertDialog.Description>
          <AlertDialog.Close>삭제 취소</AlertDialog.Close>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
function LongDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>패널 열기</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Content>
              <Drawer.Title>패널 설정</Drawer.Title>
              <Drawer.Description>{long.repeat(4)}</Drawer.Description>
              <label>
                메모
                <Input defaultValue="입력 보존" />
              </label>
              <Drawer.Close>패널 닫기</Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
function Navigation() {
  return (
    <Sidebar.Provider>
      <Sidebar.Trigger render={<Button />}>탐색 열기</Sidebar.Trigger>
      <Sidebar.Panel title={long} closeLabel="탐색 닫기">
        <Sidebar.Header>내 작업</Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu>
            {Array.from({ length: 35 }, (_, i) => (
              <Sidebar.Item key={i}>
                <Sidebar.Link href={`#item-${i}`}>
                  작업 {i + 1} {long}
                </Sidebar.Link>
              </Sidebar.Item>
            ))}
          </Sidebar.Menu>
        </Sidebar.Content>
        <Sidebar.Footer>계정 정보</Sidebar.Footer>
      </Sidebar.Panel>
    </Sidebar.Provider>
  );
}
function Notify() {
  const manager = Toast.useToastManager();
  const [actions, setActions] = useState(0);
  return (
    <>
      <Button
        onClick={() =>
          manager.add({
            title: "작업을 마쳤습니다",
            description: params.has("tall") ? long.repeat(5) : long,
            timeout: 0,
            actionProps: {
              children: "변경한프로젝트의이전설정으로모두되돌리기",
              onClick: () => setActions((n) => n + 1),
            },
          })
        }
      >
        결과 알림
      </Button>
      <output>{actions}</output>
      <Toast.Toaster />
    </>
  );
}
function ToastCase() {
  return (
    <Toast.Provider>
      <Notify />
    </Toast.Provider>
  );
}
function Cards() {
  const [selected, setSelected] = useState("");
  return (
    <>
      <Carousel
        label="프로젝트"
        items={[0, 1, 2].map((i) => ({
          id: String(i),
          title: `프로젝트 ${i}`,
          description: long,
          media: <span>미리보기 {i}</span>,
        }))}
        onItemClick={params.has("interactive") ? setSelected : undefined}
      />
      <output>{selected}</output>
    </>
  );
}
const cases = {
  dialog: LongForm,
  alert: LongAlert,
  drawer: LongDrawer,
  sidebar: Navigation,
  toast: ToastCase,
  carousel: Cards,
};
const Demo = cases[params.get("case") as keyof typeof cases] ?? LongForm;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main style={{ maxWidth: "100%" }}>
      <Demo />
    </main>
  </StrictMode>,
);
