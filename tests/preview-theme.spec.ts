import { test, expect } from "@playwright/test";

test("preview applies the requested theme before external scripts load", async ({
  page,
}) => {
  // Block hydration entirely: the initial document must already use the requested theme.
  await page.route("**/*", (route) =>
    route.request().resourceType() === "script"
      ? route.abort()
      : route.continue(),
  );
  for (const [theme, background] of [
    ["dark", "rgb(25, 26, 31)"],
    ["light", "rgb(247, 247, 248)"],
  ] as const) {
    await page.goto(`/preview/input?theme=${theme}`);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      background,
    );
  }
});

test("dark docs request only dark previews and preserve inputs when switching theme", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  const documents: string[] = [];
  page.on("request", (request) => {
    if (
      request.resourceType() === "document" &&
      new URL(request.url()).pathname === "/preview/input"
    )
      documents.push(request.url());
  });
  await page.goto("/docs/components/input");
  const card = page.locator('[data-example="input"]');
  const frame = page.frameLocator('iframe[title="input 예제"]');
  const input = frame.getByRole("textbox", {
    name: "프로젝트 이름",
    exact: true,
  });
  await input.fill("테마 변경 후에도 유지");
  expect(documents).toHaveLength(1);
  expect(new URL(documents[0]).searchParams.get("theme")).toBe("dark");
  const iframe = await card.locator("iframe").elementHandle();
  await card
    .getByRole("button", { name: "예제 테마 전환", exact: true })
    .click();
  await expect(frame.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(input).toHaveValue("테마 변경 후에도 유지");
  expect(await iframe!.evaluate((el) => el.isConnected)).toBe(true);
  expect(documents).toHaveLength(1);
  await card
    .getByRole("button", { name: "예제 테마 전환", exact: true })
    .click();
  await expect(frame.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(input).toHaveValue("테마 변경 후에도 유지");
  // Sample the loaded input through time, rather than judging a still screenshot.
  const samples = await input.evaluate(async (el) => {
    el.blur();
    el.focus();
    const frames: {
      theme: string | undefined;
      opacity: string;
      background: string;
    }[] = [];
    const start = performance.now();
    while (performance.now() - start < 500) {
      await new Promise(requestAnimationFrame);
      frames.push({
        theme: document.documentElement.dataset.theme,
        opacity: getComputedStyle(el).opacity,
        background: getComputedStyle(document.body).backgroundColor,
      });
    }
    return frames;
  });
  expect(samples.length).toBeGreaterThan(1);
  expect(
    samples.every(
      (s) =>
        s.theme === "dark" &&
        s.opacity === "1" &&
        s.background === samples[0].background,
    ),
  ).toBe(true);
  await card.getByRole("button", { name: "예제 초기화", exact: true }).click();
  await expect(input).toHaveValue("");
  expect(documents).toHaveLength(2);
});
