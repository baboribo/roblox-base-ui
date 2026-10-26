import { test, expect } from "@playwright/test";
type Entry = { id: string; type: string; title: string; name: string };
test("all registered stories render and controls reflect actual component props", async ({
  page,
  context,
  request,
}) => {
  // 100개가 넘는 스토리를 차례로 엽니다. 느린 CI 실행기에서도 끝까지 검사합니다.
  test.setTimeout(240000);
  const response = await request.get("/index.json");
  expect(response.ok()).toBe(true);
  const { entries } = await response.json();
  const stories = (Object.values(entries) as Entry[]).filter(
    (x) => x.type === "story",
  );
  expect(stories.length).toBeGreaterThanOrEqual(65);
  const errors: string[] = [];
  let current = "";
  // 한 페이지에서 스토리 200개 가까이를 계속 열면 CI에서 렌더러가 멈추거나 죽는 경우가 있습니다.
  // 스토리 40개마다 새 페이지를 쓰고, 화면이 비면 새 페이지에서 한 번만 다시 엽니다.
  // 다시 열어도 비어 있으면 실패로 보고하고, 그때까지의 페이지 오류를 함께 보여줍니다.
  async function openPage() {
    const view = await context.newPage();
    view.on("pageerror", (error) =>
      errors.push(`${current}: ${error.message}`),
    );
    return view;
  }
  const storyRoot = '#storybook-root [class*="rbx-"]';
  let view = await openPage();
  for (const [index, story] of stories.entries()) {
    current = story.id;
    if (index > 0 && index % 40 === 0) {
      await view.close();
      view = await openPage();
    }
    const url =
      "/iframe.html?id=" + encodeURIComponent(story.id) + "&viewMode=story";
    const attached = await view
      .goto(url)
      .then(() =>
        view.locator(storyRoot).first().waitFor({
          state: "attached",
          timeout: 15000,
        }),
      )
      .then(() => true)
      .catch(() => false);
    if (!attached) {
      console.log(`스토리를 새 페이지에서 다시 엽니다: ${story.id}`);
      await view.close().catch(() => {});
      view = await openPage();
      await view.goto(url);
    }
    await expect(
      view.locator(storyRoot).first(),
      `${story.id} ${errors.join(" | ")}`.trim(),
    ).toBeAttached({ timeout: 15000 });
  }
  await view.close();
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
