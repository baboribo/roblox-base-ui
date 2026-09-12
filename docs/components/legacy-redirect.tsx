"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const paths: Record<string, string> = {
  components: "components",
  foundations: "foundations",
  recipes: "patterns",
  install: "installation",
  sources: "sources",
  "default-web": "patterns",
};
export function LegacyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(
      "/docs" +
        (paths[location.hash.slice(1)]
          ? "/" + paths[location.hash.slice(1)]
          : ""),
    );
  }, [router]);
  return (
    <p>
      <a href="/docs">문서 열기</a>
    </p>
  );
}
