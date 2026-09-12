"use client";
import { useEffect, useState } from "react";
import {
  SearchDialog,
  SearchDialogHeader,
  SearchDialogInput,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogList,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { searchEntries, type SearchEntry } from "@/docs/lib/search";
export default function Search(props: SharedProps) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!props.open || entries) return;
    const controller = new AbortController();
    setError(false);
    fetch("/api/search", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setEntries)
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [props.open, entries, retry]);
  const items = entries
    ? searchEntries(entries, query).map((x) => ({
        id: x.id,
        url: x.url,
        type: "page" as const,
        content: x.title,
        description: x.description,
      }))
    : [];
  return (
    <SearchDialog
      {...props}
      search={query}
      onSearchChange={setQuery}
      isLoading={!entries && !error}
    >
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogInput
            placeholder="컴포넌트, 사용법 검색"
            aria-label="문서 검색"
          />
          <SearchDialogClose>닫기</SearchDialogClose>
        </SearchDialogHeader>
        {error ? (
          <div className="p-6" role="alert">
            검색 데이터를 불러오지 못했습니다.{" "}
            <button onClick={() => setRetry((x) => x + 1)}>다시 시도</button>
          </div>
        ) : (
          <SearchDialogList
            items={items}
            Empty={() => (
              <p className="p-6 text-sm text-fd-muted-foreground">
                {!entries
                  ? "검색 데이터 불러오는 중"
                  : query
                    ? "검색 결과가 없습니다."
                    : "이름, 한국어 별칭 또는 초성을 입력하세요."}
              </p>
            )}
          />
        )}
      </SearchDialogContent>
    </SearchDialog>
  );
}
