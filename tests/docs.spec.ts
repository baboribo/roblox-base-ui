import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("search supports Korean aliases, initials, body, keyboard selection and deep links", async ({
  page,
}) => {
  await page.goto("/docs");
  for (const [query, name, url] of [
    ["버튼", "Button", "button"],
    ["ㄷㅎㅅㅈ", "Dialog", "dialog"],
    ["manager.toasts", "Toast", "toast"],
  ]) {
    await page.keyboard.press("ControlOrMeta+k");
    const search = page.getByRole("textbox", { name: "문서 검색" });
    await expect(search).toBeVisible();
    await search.fill(query);
    await expect(
      page.getByRole("dialog").getByText(name, { exact: true }),
    ).toBeVisible();
    await search.press("ArrowDown");
    await search.press("ArrowUp");
    await search.press("Enter");
    await expect(page).toHaveURL(new RegExp("/docs/components/" + url + "$"));
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
  }
  await page.keyboard.press("ControlOrMeta+k");
  await page.getByRole("textbox", { name: "문서 검색" }).fill("결과없음123");
  await expect(
    page.getByText("검색 결과가 없습니다.", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
test("search fetch errors are visible and retryable", async ({ page }) => {
  await page.route("**/api/search", (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.goto("/docs");
  await page.keyboard.press("ControlOrMeta+k");
  await expect(page.getByRole("alert")).toContainText("불러오지 못했습니다");
  await page.unroute("**/api/search");
  await page.getByRole("button", { name: "다시 시도" }).click();
  await page.getByRole("textbox", { name: "문서 검색" }).fill("ㅂㅌ");
  await expect(
    page.getByRole("dialog").getByText("Button", { exact: true }),
  ).toBeVisible();
});
test("document layout is responsive and example theme is isolated", async ({
  page,
}) => {
  await page.goto("/docs/components/button");
  const frame = page.frameLocator('iframe[title="button 예제"]');
  await expect(frame.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .locator(".docs-example")
    .first()
    .getByRole("button", { name: "예제 테마 전환" })
    .click();
  await expect(frame.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page.screenshot({
      path: test.info().outputPath(`docs-${width}.png`),
      fullPage: true,
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/installation");
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
});
test("legacy hash links route to the matching documentation page", async ({
  page,
}) => {
  await page.goto("/#foundations");
  await expect(page).toHaveURL(/\/docs\/foundations$/);
  await page.goto("/docs/components/does-not-exist");
  await expect(page.getByText("페이지를 찾을 수 없습니다.")).toBeVisible();
});

test("mobile document navigation opens, navigates and closes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs");
  const trigger = page
    .getByRole("navigation", { name: "문서 도구" })
    .getByRole("button", { name: "탐색 열기", exact: true });
  await trigger.click();
  const link = page
    .locator("#nd-sidebar-mobile")
    .getByRole("link", { name: "설치", exact: true });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/docs\/installation$/);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#nd-sidebar-mobile")).toBeHidden();
  await page.getByRole("button", { name: "검색 열기", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "문서 검색" })).toBeVisible();
  await page.getByRole("textbox", { name: "문서 검색" }).fill("ㅂㅌ");
  await expect(
    page.getByRole("dialog").getByText("Button", { exact: true }),
  ).toBeVisible();
});

test("generated API properties and preview reset are usable", async ({
  page,
}) => {
  await page.goto("/docs/components/input");
  await expect(
    page.getByRole("heading", { name: /^속성/, level: 2 }),
  ).toBeVisible();
  const api = page.locator('[id="type-table-input.tsx-InputProps"]');
  await expect(api).toContainText("controlSize");
  await expect(api).toContainText("leading");
  await api.getByRole("button", { name: /^controlSize/ }).click();
  await expect(api).toContainText("기본값");
  await expect(api).toContainText("컨트롤 높이");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(api.getByText("기본값", { exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  const accessibility = await new AxeBuilder({ page })
    .include('[id="type-table-input.tsx-InputProps"]')
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.goto("/docs/components/switch");
  const frame = page.frameLocator('iframe[title="switch-controlled 예제"]');
  await frame.getByRole("switch").click();
  await expect(frame.getByRole("status")).toHaveText("자동 저장: 켜짐");
  await page
    .locator(".docs-example")
    .filter({ has: page.locator('iframe[title="switch-controlled 예제"]') })
    .getByRole("button", { name: "예제 초기화" })
    .click();
  await expect(frame.getByRole("status")).toHaveText("자동 저장: 꺼짐");
});

test("a failing preview keeps the document usable and can reload successfully", async ({
  page,
}) => {
  // iframe 문서 응답에 렌더 오류를 주입합니다. init script의 iframe 실행 시점에 의존하지 않습니다.
  let failPreview = true;
  await page.route(/\/preview\/input(?:\?|$)/, async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    const fault = `<script>const originalCreate = document.createElement.bind(document); document.createElement = function(tag, options) { if (tag === "input") throw new Error("intentional preview render failure"); return originalCreate(tag, options); };</script>`;
    await route.fulfill({
      response,
      body: failPreview ? body.replace("<head>", "<head>" + fault) : body,
    });
  });
  await page.goto("/docs/components/input");
  const frame = page.frameLocator('iframe[title="input 예제"]');
  await expect(frame.getByRole("alert", { name: "예제 오류" })).toContainText(
    "예제를 표시하지 못했습니다.",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Input");
  await page
    .locator(".docs-example")
    .first()
    .getByRole("tab", { name: "코드", exact: true })
    .click();
  await expect(page.locator(".docs-example pre").first()).toContainText(
    "InputExample",
  );
  await page
    .locator(".docs-example")
    .first()
    .getByRole("tab", { name: "미리보기" })
    .click();
  failPreview = false;
  await frame.getByRole("button", { name: "예제 다시 불러오기" }).click();
  await expect(frame.getByRole("textbox").first()).toBeVisible();
  await expect(frame.getByRole("alert", { name: "예제 오류" })).toHaveCount(0);
  await frame.getByRole("textbox").first().fill("복구 확인");
  await expect(frame.getByRole("textbox").first()).toHaveValue("복구 확인");
});
