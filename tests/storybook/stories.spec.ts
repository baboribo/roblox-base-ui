import { test, expect } from "@playwright/test";
type Entry = { id: string; type: string; title: string; name: string };
test("all registered stories render and controls reflect actual component props", async ({
  page,
  request,
}) => {
  const response = await request.get("/index.json");
  expect(response.ok()).toBe(true);
  const { entries } = await response.json();
  const stories = (Object.values(entries) as Entry[]).filter(
    (x) => x.type === "story",
  );
  expect(stories.length).toBeGreaterThanOrEqual(65);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const story of stories) {
    await page.goto(
      "/iframe.html?id=" + encodeURIComponent(story.id) + "&viewMode=story",
    );
    await expect(
      page.locator(
        '#storybook-root .rbx-button, #storybook-root [class*="rbx-"]',
      ),
    ).not.toHaveCount(0);
  }
  expect(errors).toEqual([]);
  const button = stories.find(
    (x) => x.title === "입력/Button" && x.id.endsWith("--default"),
  )!;
  await page.goto(
    "/iframe.html?id=" +
      encodeURIComponent(button.id) +
      "&viewMode=story&args=disabled:true;size:sm&globals=theme:dark",
  );
  await expect(
    page.getByRole("button", { name: "저장", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "저장", exact: true }),
  ).toHaveCSS("height", "32px");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const form = stories.find(
    (x) => x.title === "입력/Form" && x.id.endsWith("--default"),
  )!;
  await page.goto(
    "/iframe.html?id=" + encodeURIComponent(form.id) + "&viewMode=story",
  );
  await page
    .getByRole("textbox", { name: "연락 이메일" })
    .fill("test@example.com");
  await page.getByRole("button", { name: "저장하기", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("입력값을 저장했습니다.");
});

test("variant matrices render every size and state as actual controls", async ({
  page,
}) => {
  await page.goto(
    "/iframe.html?id=" +
      encodeURIComponent("입력-button--matrix") +
      "&viewMode=story&globals=theme:dark",
  );
  const enabled = page.getByRole("table", {
    name: "Button · 기본",
    exact: true,
  });
  const disabled = page.getByRole("table", {
    name: "Button · 비활성",
    exact: true,
  });
  await expect(enabled.getByRole("button")).toHaveCount(36);
  await expect(disabled.getByRole("button")).toHaveCount(36);
  await expect(disabled.locator("button:disabled")).toHaveCount(36);
  for (const [size, height] of [
    ["xs", "24px"],
    ["sm", "32px"],
    ["md", "40px"],
    ["lg", "48px"],
  ]) {
    await expect(enabled.locator(`[data-size="${size}"]`).first()).toHaveCSS(
      "height",
      height,
    );
  }
  await page.goto(
    "/iframe.html?id=" +
      encodeURIComponent("입력-input--matrix") +
      "&viewMode=story",
  );
  await expect(page.getByRole("textbox")).toHaveCount(36);
  await expect(page.locator("input:disabled")).toHaveCount(12);
  await expect(page.locator('input[aria-invalid="true"]')).toHaveCount(12);
  const invalid = page.getByRole("textbox", {
    name: "standard md 오류",
    exact: true,
  });
  await invalid.fill("수정한 값");
  await expect(invalid).toHaveValue("수정한 값");
});
