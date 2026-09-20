import { createRoot } from "react-dom/client";
import "./composition.css";
import "../../../src/styles/theme.css";
import { Button } from "../../../src/components/ui/button";
import { IconButton } from "../../../src/components/ui/icon-button";
import { Input } from "../../../src/components/ui/input";
import { Badge } from "../../../src/components/ui/badge";
import { Card, CardContent } from "../../../src/components/ui/card";
import { Menu } from "../../../src/components/ui/menu";
import { ResponsiveLayoutExample } from "../../../examples/responsive-layout";
import { Field } from "../../../src/components/ui/field";
function App() {
  return new URLSearchParams(location.search).has("screen") ? (
    <main className="p-4">
      <ResponsiveLayoutExample />
    </main>
  ) : (
    <main className="p-4 grid gap-6 max-w-xl">
      <section aria-label="User styles">
        <Button className="h-16 min-h-0 w-40 rounded-none bg-red-600">
          Override
        </Button>
        <IconButton
          className="w-16 h-16 min-h-0"
          aria-label="Icon override"
          icon="icon-regular-plus-large"
        />
      </section>
      <section aria-label="Inputs">
        <Input className="max-w-40 h-16" aria-label="Plain" />
        <Input className="max-w-40 h-16" leading="@" aria-label="Decorated" />
      </section>
      <Card>
        <CardContent>
          <Badge>초안</Badge>
          <Button>저장</Button>
          <IconButton aria-label="추가" icon="icon-regular-plus-large" />
        </CardContent>
      </Card>
      <div className="flex gap-2 w-72">
        <Input aria-label="검색" />
        <Button>검색하기</Button>
      </div>
      <Field.Root disabled>
        <Field.Label>비활성</Field.Label>
        <Input aria-label="Disabled field" />
      </Field.Root>
      <Menu.Root>
        <Menu.Trigger>Standalone trigger</Menu.Trigger>
      </Menu.Root>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
