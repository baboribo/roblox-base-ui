/** 목록 길이와 무관하게 처음·끝·현재 주변 페이지만 만듭니다. */
export function paginationItems(
  page: number,
  count: number,
): Array<number | "gap-start" | "gap-end"> {
  const pages = new Set([1, count, page - 1, page, page + 1]);
  if (page <= 3) for (let n = 1; n <= 5; n++) pages.add(n);
  if (page >= count - 2) for (let n = count - 4; n <= count; n++) pages.add(n);
  const visible = [...pages]
    .filter((n) => n >= 1 && n <= count)
    .sort((a, b) => a - b);
  const result: Array<number | "gap-start" | "gap-end"> = [];
  for (const [index, value] of visible.entries()) {
    const previous = visible[index - 1];
    if (previous !== undefined && value - previous === 2)
      result.push(previous + 1);
    else if (previous !== undefined && value - previous > 2)
      result.push(value <= page ? "gap-start" : "gap-end");
    result.push(value);
  }
  return result;
}
