import { createRoot } from "react-dom/client";
import { Menu } from "../../../src/components/ui/menu";
import "../../../src/styles/theme.css";
function App() {
  return (
    <main>
      <Menu.Root>
        <Menu.Trigger>Menu only</Menu.Trigger>
      </Menu.Root>
      <button
        onClick={async (event) => {
          const button = event.currentTarget;
          await import("../../../src/components/ui/button");
          button.dataset.loaded = "true";
        }}
      >
        Load unrelated Button
      </button>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
