import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";

test("document navigation opens the bundled Storybook on the same origin", async ({
  page,
  request,
}) => {
  const redirect = await request.get("/storybook", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/storybook/index.html");
  await page.goto("/docs");
  const link = page.getByRole("link", { name: "Storybook", exact: true });
  await expect(link).toHaveAttribute("href", "/storybook");
  const opened = page.waitForEvent("popup");
  await link.click();
  const storybook = await opened;
  await storybook.waitForLoadState();
  expect(new URL(storybook.url()).origin).toBe(new URL(page.url()).origin);
  expect(new URL(storybook.url()).pathname).toBe("/storybook/index.html");
  await expect(storybook.locator("#storybook-preview-iframe")).toBeAttached();
  expect(existsSync("public/storybook/storybook")).toBe(false);
  expect(existsSync("storybook-static/storybook")).toBe(false);
});

test("Storybook deep links, controls and document links work below a subpath", async ({
  page,
}) => {
  await page.goto(
    "/storybook/?path=/story/" +
      encodeURIComponent("콘텐츠-card--case-card-asset-detail"),
  );
  const frame = page.frameLocator("#storybook-preview-iframe");
  await frame.getByRole("button", { name: "기본 큐브" }).click();
  await expect(frame.getByRole("dialog")).toBeVisible();
  await frame.getByRole("button", { name: "닫기" }).click();
  await page.reload();
  await expect(frame.getByRole("button", { name: "기본 큐브" })).toBeVisible();
  await page.goto(
    "/storybook/index.html?path=/story/" +
      encodeURIComponent("콘텐츠-card--case-card-project"),
  );
  await frame.getByRole("link", { name: "UI 문서" }).click();
  await expect(page).toHaveURL(/\/docs$/);
});

// 100개가 넘는 스토리를 차례로 여는 무거운 검사라 다른 검사와 동시에 돌리지 않습니다(playwright.config.ts의 isolated 프로젝트).
test(
  "every story loads its assets from the deployed subpath",
  {
    tag: "@isolated",
  },
  async ({ page, context, request }) => {
    test.setTimeout(240000);
    const response = await request.get("/storybook/index.json");
    expect(response.ok()).toBe(true);
    const { entries } = await response.json();
    const stories = Object.values(entries).filter(
      (entry: any) => entry.type === "story",
    ) as { id: string }[];
    const errors: string[] = [];
    let current = "";
    // 한 페이지에서 스토리 200개 가까이를 계속 열면 CI에서 렌더러가 멈추거나 죽는 경우가 있습니다.
    // 스토리 40개마다 새 페이지를 쓰고, 화면이 비면 새 페이지에서 한 번만 다시 엽니다.
    async function openPage() {
      const view = await context.newPage();
      view.on("pageerror", (error) =>
        errors.push(`${current}: ${error.message}`),
      );
      view.on("response", (response) => {
        if (
          new URL(response.url()).pathname.startsWith("/storybook/") &&
          response.status() >= 400
        )
          errors.push(response.url());
      });
      return view;
    }
    const storyRoot = '#storybook-root [class*="rbx-"]';
    expect(stories.length).toBeGreaterThan(100);
    let view = await openPage();
    for (const [index, story] of stories.entries()) {
      current = story.id;
      if (index > 0 && index % 40 === 0) {
        await view.close();
        view = await openPage();
      }
      const url =
        "/storybook/iframe.html?id=" +
        encodeURIComponent(story.id) +
        "&viewMode=story";
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
    await page.goto(
      "/storybook/iframe.html?id=" +
        encodeURIComponent("입력-button--default") +
        "&viewMode=story&args=disabled:true;size:sm&globals=theme:dark",
    );
    await expect(
      page.getByRole("button", { name: "저장", exact: true }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "저장", exact: true }),
    ).toHaveCSS("height", "32px");
  },
);
