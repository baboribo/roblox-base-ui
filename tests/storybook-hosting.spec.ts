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

test("every story loads its assets from the deployed subpath", async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  const response = await request.get("/storybook/index.json");
  expect(response.ok()).toBe(true);
  const { entries } = await response.json();
  const stories = Object.values(entries).filter(
    (entry: any) => entry.type === "story",
  ) as { id: string }[];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      new URL(response.url()).pathname.startsWith("/storybook/") &&
      response.status() >= 400
    )
      errors.push(response.url());
  });
  expect(stories.length).toBeGreaterThan(100);
  for (const story of stories) {
    await page.goto(
      "/storybook/iframe.html?id=" +
        encodeURIComponent(story.id) +
        "&viewMode=story",
    );
    await expect(
      page.locator('#storybook-root [class*="rbx-"]').first(),
    ).toBeAttached();
  }
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
});
