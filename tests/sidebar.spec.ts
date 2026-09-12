import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("sidebar component keeps selection state and measured row geometry", async ({
  page,
}) => {
  await page.goto("/preview/sidebar?theme=dark");
  const row = page.getByRole("button", { name: "Profile", exact: true });
  await row.click();
  await expect(page.getByRole("status")).toContainText("Profile");
  await expect(row).toHaveCSS("height", "40px");
  await expect(row).toHaveCSS("border-radius", "8px");
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
});
test("responsive sidebar traps focus, dismisses, restores focus and changes at breakpoint", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["light", "dark"]) {
    await page.goto("/preview/sidebar-responsive?theme=" + theme);
    const trigger = page.getByRole("button", { name: "예제 탐색 열기" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "반응형 탐색 예제" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Shift+Tab");
    await expect
      .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("button", { name: "보관함", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("status")).toContainText("보관함");
    await trigger.click();
    await expect(page.locator(".rbx-sidebar-popup")).toHaveCSS(
      "transition-duration",
      "0s",
    );
    await page.keyboard.press("Escape");
  }
  await page.evaluate(() => {
    document.documentElement.dir = "rtl";
  });
  await page.getByRole("button", { name: "예제 탐색 열기" }).click();
  await expect
    .poll(() =>
      page
        .locator(".rbx-sidebar-popup")
        .evaluate((el) => el.getBoundingClientRect().right),
    )
    .toBe(390);
  await page.setViewportSize({ width: 1141, height: 900 });
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "프로젝트 화면 선택" }),
  ).toBeVisible();
});
