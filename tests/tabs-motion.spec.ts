import { test, expect } from "@playwright/test";

test("one indicator slides to the clicked tab and follows keyboard selection", async ({
  page,
}) => {
  await page.goto("/preview/tabs");
  const indicator = page.locator(".rbx-tab-indicator");
  await expect(indicator).toBeVisible();
  const initial = (await indicator.boundingBox())!;
  const activity = page.getByRole("tab", { name: "활동", exact: true });
  await activity.click();
  expect(
    await indicator.evaluate((el) => el.getAnimations().length),
  ).toBeGreaterThan(0);
  await expect
    .poll(async () => {
      const bar = (await indicator.boundingBox())!;
      const tab = (await activity.boundingBox())!;
      return Math.abs(bar.x - tab.x) + Math.abs(bar.width - tab.width);
    })
    .toBeLessThan(1);
  expect((await indicator.boundingBox())!.x).toBeGreaterThan(initial.x);
  await expect(activity).toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
  await activity.press("ArrowLeft");
  const settings = page.getByRole("tab", { name: "설정", exact: true });
  await expect(settings).toBeFocused();
  await settings.press("Enter");
  await expect(
    page.getByRole("tab", { name: "설정", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(indicator).toHaveCount(1);
});

test("manual tabs move on selection only and reduced motion is immediate", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/tabs-manual");
  const indicator = page.locator(".rbx-tab-indicator");
  await expect(indicator).toBeVisible();
  const initial = (await indicator.boundingBox())!;
  await page.getByRole("tab", { name: "정보", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  const settings = page.getByRole("tab", { name: "설정", exact: true });
  await expect(settings).toBeFocused();
  expect((await indicator.boundingBox())!.x).toBe(initial.x);
  await settings.press("Enter");
  await expect(settings).toHaveAttribute("aria-selected", "true");
  await expect(indicator).toHaveCSS("transition-duration", "0s");
  const bar = (await indicator.boundingBox())!;
  expect(Math.abs(bar.x - (await settings.boundingBox())!.x)).toBeLessThan(1);
});

test("panels exit opposite the selected direction, pause, then enter", async ({
  page,
}) => {
  await page.goto("/preview/tabs");
  const panels = page.locator(".rbx-tab-panels > .rbx-tab-panel");
  const overview = panels.filter({ hasText: "프로젝트의 기본 정보입니다." });
  await expect(overview).toHaveCSS("opacity", "1");
  for (const [label, text, sign] of [
    ["활동", "활동 내역이 없습니다.", -1],
    ["개요", "프로젝트의 기본 정보입니다.", 1],
  ] as const) {
    await page.getByRole("tab", { name: label, exact: true }).click();
    const exiting = page.locator(".rbx-tab-panel[data-ending-style]");
    const entering = panels.filter({ hasText: text });
    await expect(exiting).toHaveCount(1);
    await page.waitForTimeout(80);
    const x = await exiting.evaluate(
      (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
    );
    expect(x * sign).toBeGreaterThan(0);
    await expect(entering).toHaveCSS("visibility", "hidden");
    await expect.poll(() => exiting.count(), { intervals: [10] }).toBe(0);
    // The old panel has left, but the new panel must still wait for the 100ms gap.
    await expect(entering).toHaveCSS("visibility", "hidden");
    await expect(entering).toHaveCSS("transition-delay", "0.3s");
    await expect(entering).toHaveCSS("opacity", "1");
    await expect(entering).toBeVisible();
  }
});

test("rapid panel changes settle on the last selection; reduced motion skips the gap", async ({
  page,
}) => {
  await page.goto("/preview/tabs");
  for (const name of ["활동", "설정", "개요", "활동"]) {
    await page.getByRole("tab", { name, exact: true }).click();
  }
  const active = page
    .locator(".rbx-tab-panel")
    .filter({ hasText: "활동 내역이 없습니다." });
  await expect(active).toHaveCSS("opacity", "1");
  await expect(page.locator(".rbx-tab-panel")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("tab", { name: "설정", exact: true }).click();
  const settings = page
    .locator(".rbx-tab-panel")
    .filter({ hasText: "프로젝트 설정입니다." });
  await expect(settings).toBeVisible();
  await expect(settings).toHaveCSS("transition-duration", "0s");
  expect(await settings.evaluate((el) => el.getAnimations().length)).toBe(0);
});
