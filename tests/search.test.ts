import { test } from "node:test";
import assert from "node:assert/strict";
import { searchEntries, type SearchEntry } from "../docs/lib/search";
const data: SearchEntry[] = [
  {
    id: "button",
    url: "/button",
    title: "Button",
    description: "작업 실행",
    keywords: ["버튼"],
    body: "폼을 제출합니다.",
  },
  {
    id: "dialog",
    url: "/dialog",
    title: "Dialog",
    description: "대화상자",
    keywords: ["다이얼로그", "대화상자", "모달"],
    body: "포커스를 관리하고 Escape로 닫습니다.",
  },
  {
    id: "other",
    url: "/other",
    title: "Other",
    description: "버튼을 포함합니다.",
    keywords: [],
    body: "사용 안내",
  },
];
test("names, Korean aliases and initials rank direct matches first", () => {
  for (const q of ["Button", "button", "버튼", "ㅂㅌ", "버ㅌ", "버트"])
    assert.equal(searchEntries(data, q)[0]?.id, "button", q);
  for (const q of ["대화상자", "ㄷㅎㅅㅈ", "모달", "ㅁㄷ"])
    assert.equal(searchEntries(data, q)[0]?.id, "dialog", q);
});
test("search normalizes Hangul and whitespace and matches document text", () => {
  assert.equal(searchEntries(data, "버튼".normalize("NFD"))[0]?.id, "button");
  assert.equal(searchEntries(data, "  포커스  Escape ")[0]?.id, "dialog");
  assert.deepEqual(searchEntries(data, "없는내용"), []);
  assert.deepEqual(searchEntries(data, " "), []);
  // Initials only apply to names/aliases, never accidental body matches.
  assert.deepEqual(searchEntries(data, "ㅍㅋㅅ"), []);
});
