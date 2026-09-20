import { StrictMode, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../../src/components/ui/button";
import { Pagination } from "../../../src/components/ui/pagination";
import { Tooltip } from "../../../src/components/ui/tooltip";
import { Menu } from "../../../src/components/ui/menu";
import { Dialog } from "../../../src/components/ui/dialog";
import { Tabs } from "../../../src/components/ui/tabs";
import { Toolbar } from "../../../src/components/ui/toolbar";
import { OTPField } from "../../../src/components/ui/otp-field";
import { ScrollArea } from "../../../src/components/ui/scroll-area";
import { Combobox } from "../../../src/components/ui/combobox";
import { Carousel } from "../../../src/components/ui/carousel";
import { NavigationItem } from "../../../src/components/ui/navigation-item";
import { Textarea } from "../../../src/components/ui/textarea";
import themeSource from "../../../src/styles/theme.css?raw";
import { Badge } from "../../../src/components/ui/badge";
import { List } from "../../../src/components/ui/list";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../../../src/components/ui/table";
import "../../../src/styles/theme.css";
const long = "VeryLongProjectNameWithoutSpaces".repeat(4);
const params = new URLSearchParams(location.search);
const width = Number(params.get("width") ?? 240);
function Loading() {
  const [loading, setLoading] = useState(false);
  const [clicks, setClicks] = useState(0);
  const link = useRef<HTMLElement>(null);
  return (
    <>
      <button onClick={() => setLoading(!loading)}>Toggle loading</button>
      <Button
        loading={loading}
        onClick={() => {
          setClicks(clicks + 1);
          setLoading(true);
        }}
      >
        Save project
      </Button>
      <Button
        loading={loading}
        nativeButton={false}
        render={
          <a href="#destination" ref={link as React.Ref<HTMLAnchorElement>}>
            Open project
          </a>
        }
      />
      <Button
        loading={loading}
        nativeButton={false}
        render={(props) => (
          <a {...props} href="#destination">
            Custom link
          </a>
        )}
      />
      <output>{clicks}</output>
    </>
  );
}
function Paging() {
  const [count, setCount] = useState(10);
  const [last, setLast] = useState(8);
  return (
    <>
      <button onClick={() => setCount(count === 10 ? 3 : 10)}>Filter</button>
      <Pagination pageCount={count} defaultPage={8} onPageChange={setLast} />
      <output>{last}</output>
      <Pagination
        aria-label="Huge pages"
        pageCount={1000000}
        defaultPage={999990}
      />
    </>
  );
}
const handle = Tooltip.createHandle<string>();
function Tips() {
  return (
    <Tooltip.Provider delay={0}>
      <p id="extra">Existing description</p>
      <Tooltip.Root>
        <Tooltip.Trigger
          delay={0}
          render={<button aria-describedby="extra">Rendered trigger</button>}
        />
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup
              render={<div id="rendered-description">Rendered explanation</div>}
            />
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger aria-describedby="extra">First tip</Tooltip.Trigger>
        <Tooltip.Trigger>Second tip</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup id="shared-tip">Shared explanation</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Tooltip.Trigger handle={handle} payload="External explanation">
        External tip
      </Tooltip.Trigger>
      <Tooltip.Root handle={handle}>
        {({ payload }) => (
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>{payload}</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
function Portals() {
  const [dark, setDark] = useState(false);
  return (
    <section dir="rtl" data-theme="light">
      <button onClick={() => setDark(!dark)}>Override theme</button>
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal data-theme={dark ? "dark" : "light"}>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Title>{long}</Dialog.Title>
            <Dialog.Description>{long}</Dialog.Description>
            <Dialog.Close>Close dialog</Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <Menu.Root>
        <Menu.Trigger style={{ width: "100%" }}>Open menu</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup>
              <Menu.Item>{long}</Menu.Item>
              <Menu.Item>Another choice</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </section>
  );
}
function Layout() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Button>{long}</Button>
      <Badge>{long}</Badge>
      <button onClick={() => setTab(7)}>Select last tab</button>
      <Tabs.Root
        value={tab}
        onValueChange={(value) => setTab(Number(value))}
        orientation={params.has("vertical") ? "vertical" : "horizontal"}
      >
        <Tabs.List>
          {Array.from({ length: 8 }, (_, i) => (
            <Tabs.Tab key={i} value={i}>
              Tab number {i + 1}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {Array.from({ length: 8 }, (_, i) => (
          <Tabs.Panel key={i} value={i}>
            {long}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
      <Toolbar.Root aria-label="Actions">
        {Array.from({ length: 8 }, (_, i) => (
          <Toolbar.Button key={i}>Action {i + 1}</Toolbar.Button>
        ))}
      </Toolbar.Root>
      <label htmlFor="otp">Verification code</label>
      <OTPField.Root id="otp" length={6}>
        {Array.from({ length: 6 }, (_, i) => (
          <OTPField.Input key={i} />
        ))}
      </OTPField.Root>
      <List.Root>
        <List.Item>
          <List.Content>
            <List.Title>{long}</List.Title>
            <List.Description>{long}</List.Description>
          </List.Content>
        </List.Item>
      </List.Root>
      <Table>
        <TableCaption>Records</TableCaption>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 8 }, (_, i) => (
              <TableHead key={i}>Column {i}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {Array.from({ length: 8 }, (_, i) => (
              <TableCell key={i}>{long}</TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
      <ScrollArea.Root style={{ height: 100 }}>
        <ScrollArea.Viewport>
          <div style={{ width: 800, height: 200 }}>Scrollable content</div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </>
  );
}
function Details() {
  return (
    <>
      <List.Root>
        <List.Item>
          <List.Content leading={0} trailing={0}>
            <List.Title>Zero counts</List.Title>
          </List.Content>
        </List.Item>
      </List.Root>
      <NavigationItem leading={0} trailing={0}>
        Zero navigation
      </NavigationItem>
      <Combobox.Root
        multiple
        defaultValue={["A long selected asset name", "Another asset"]}
      >
        <Combobox.Chips>
          <Combobox.Value>
            {(values: string[]) =>
              values.map((value) => (
                <Combobox.Chip key={value}>
                  {value}
                  <Combobox.ChipRemove aria-label={"Remove " + value}>
                    ×
                  </Combobox.ChipRemove>
                </Combobox.Chip>
              ))
            }
          </Combobox.Value>
          <Combobox.Input aria-label="Search assets" />
        </Combobox.Chips>
      </Combobox.Root>
      <Carousel
        label="Narrow cards"
        items={[0, 1, 2].map((id) => ({
          id: String(id),
          title: "Card " + id,
          description: long,
          media: <span>Image {id}</span>,
        }))}
      />
    </>
  );
}
function StyleOrder() {
  return (
    <>
      <button
        onClick={() => {
          const style = document.createElement("style");
          style.textContent = themeSource.replace(/@import[^;]+;/g, "");
          document.head.append(style);
        }}
      >
        Load theme last
      </button>
      <Button>Normal button</Button>
      <Textarea aria-label="Long textarea" rows={8} />
    </>
  );
}
const cases = {
  order: StyleOrder,
  details: Details,
  loading: Loading,
  paging: Paging,
  tips: Tips,
  portals: Portals,
  layout: Layout,
};
const Demo = cases[params.get("case") as keyof typeof cases] ?? Layout;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main style={{ width: `min(100%, ${width}px)` }}>
      <Demo />
    </main>
  </StrictMode>,
);
