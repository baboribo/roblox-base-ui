import { getChoseong, disassemble } from "es-hangul";
export type SearchEntry = {
  id: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  body: string;
};
export const normalize = (text: string) =>
  text
    .normalize("NFC")
    .toLowerCase()
    .replace(/[-_/\s]+/g, " ")
    .trim();
const compact = (text: string) => normalize(text).replaceAll(" ", "");
export function searchEntries(
  entries: SearchEntry[],
  input: string,
): SearchEntry[] {
  const query = normalize(input);
  if (!query) return [];
  const terms = query.split(" ");
  const initial = /^[ㄱ-ㅎ ]+$/.test(query);
  const score = (entry: SearchEntry) => {
    const name = normalize(entry.title);
    const aliases = entry.keywords.map(normalize);
    const labels = [name, ...aliases];
    if (labels.some((s) => compact(s) === compact(query))) return 1000;
    if (initial)
      return labels.some((s) =>
        getChoseong(compact(s)).startsWith(compact(query)),
      )
        ? 600
        : 0;
    if (labels.some((s) => s.startsWith(query))) return 800;
    if (labels.some((s) => compact(s).includes(compact(query)))) return 700;
    // Match the last incomplete Hangul syllable while the user is typing.
    if (
      /[가-힣]/.test(query) &&
      labels.some((s) =>
        disassemble(compact(s)).startsWith(disassemble(compact(query))),
      )
    )
      return 500;
    const text = normalize(
      [entry.title, ...entry.keywords, entry.description, entry.body].join(" "),
    );
    return terms.every((term) => text.includes(term)) ? 100 : 0;
  };
  return entries
    .map((entry) => ({ entry, score: score(entry) }))
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.entry.title.length - b.entry.title.length ||
        a.entry.title.localeCompare(b.entry.title),
    )
    .slice(0, 20)
    .map((x) => x.entry);
}
