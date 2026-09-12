"use client";
import { RootProvider } from "fumadocs-ui/provider/next";
import Search from "./search";
import { translations } from "@/docs/lib/translations";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider
      theme={{ defaultTheme: "light" }}
      i18n={{
        locale: "ko",
        translations,
      }}
      search={{ SearchDialog: Search }}
    >
      {children}
    </RootProvider>
  );
}
