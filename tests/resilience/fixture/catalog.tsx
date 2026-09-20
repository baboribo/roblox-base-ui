import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "../../../src/styles/theme.css";
// Discover dependencies once. Remount each example without reparsing the whole catalog.
const modules = import.meta.glob("../../../examples/*.tsx", { eager: true });
const root = createRoot(document.getElementById("root")!);
function renderExample(name: string, theme: string) {
  document.documentElement.dataset.theme = theme;
  const mod = modules[`../../../examples/${name}.tsx`] as Record<
    string,
    ComponentType
  >;
  const entry = Object.entries(mod).find(([name]) => name.endsWith("Example"));
  if (!entry) throw new Error("Missing example export");
  const Component = entry[1];
  root.render(
    <StrictMode>
      <main key={name} data-example={name}>
        <Component />
      </main>
    </StrictMode>,
  );
}
window.addEventListener("ply-audit-example", (event) => {
  const { name, theme } = (
    event as CustomEvent<{ name: string; theme: string }>
  ).detail;
  renderExample(name, theme);
});
const params = new URLSearchParams(location.search);
renderExample(
  params.get("name") ?? "accordion",
  params.get("theme") ?? "light",
);
