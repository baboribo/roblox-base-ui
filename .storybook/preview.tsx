import type { Preview } from "@storybook/react-vite";
import React, { useEffect } from "react";
import "../src/styles/theme.css";
import "../src/styles/fonts.css";
import "./preview.css";
function Theme({
  theme,
  children,
}: {
  theme: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return <>{children}</>;
}
export default {
  globalTypes: {
    theme: {
      description: "테마",
      toolbar: {
        title: "테마",
        icon: "circlehollow",
        items: [
          { value: "light", title: "라이트" },
          { value: "dark", title: "다크" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: { layout: "padded", controls: { expanded: true } },
  decorators: [
    (Story, context) => (
      <Theme theme={context.globals.theme}>
        <Story />
      </Theme>
    ),
  ],
} satisfies Preview;
