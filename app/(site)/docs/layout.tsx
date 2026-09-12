import { DocsHeader } from "@/docs/components/layout-slots";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { source } from "@/docs/lib/source";
import { Providers } from "@/docs/components/providers";
import "../global.css";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DocsLayout
        slots={{ header: DocsHeader }}
        tree={source.getPageTree()}
        nav={{ title: "Roblox Base UI", url: "/docs" }}
        sidebar={{ defaultOpenLevel: 1 }}
        links={[
          { text: "컴포넌트", url: "/docs/components" },
          { text: "개발 안내", url: "/docs/development" },
          {
            text: "Storybook",
            url: "/storybook",
            external: true,
          },
        ]}
      >
        {children}
      </DocsLayout>
    </Providers>
  );
}
