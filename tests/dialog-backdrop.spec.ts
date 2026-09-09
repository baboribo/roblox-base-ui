import { test, expect } from "@playwright/test";

test("page dialogs retain their full-screen backdrop outside the sidebar modal", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#default-web");
    await page.reload(); // 같은 hash 재이동은 React 테마 상태를 초기화하지 않습니다.
    for (const theme of ["dark", "light"]) {
      if (theme === "light")
        await page.getByRole("button", { name: "라이트 테마로 전환" }).click();
      const trigger = page.getByRole("button", {
        name: "Change Name",
        exact: true,
      });
      await trigger.click();
      const popup = page.getByRole("dialog");
      const backdrop = page.locator(".rbx-backdrop");
      await expect(popup).toBeVisible();
      await expect(backdrop).toBeVisible();
      await expect(backdrop).toHaveCSS("opacity", "1");
      await expect(backdrop).toHaveCSS(
        "background-color",
        theme === "dark" ? "rgba(10, 10, 14, 0.75)" : "rgba(10, 10, 14, 0.5)",
      );
      expect(
        await backdrop.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        }),
      ).toEqual({ x: 0, y: 0, width, height: 900 });
      expect(
        await popup.evaluate((el) => Number(getComputedStyle(el).zIndex)),
      ).toBeGreaterThan(
        await backdrop.evaluate((el) => Number(getComputedStyle(el).zIndex)),
      );
      await page.screenshot({
        path: test.info().outputPath(`dialog-${width}-${theme}.png`),
      });
      await page.keyboard.press("Escape");
      await expect(backdrop).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await backdrop.click({ position: { x: 10, y: 100 } });
      await expect(popup).toBeHidden();
      await expect(trigger).toBeFocused();
    }
  }
});

test("catalog Dialog and AlertDialog render backdrops too", async ({
  page,
}) => {
  await page.goto("/#components");
  const nav = page.getByRole("navigation", { name: "컴포넌트 목록" });
  for (const [component, trigger, role] of [
    ["Dialog", "프로젝트 편집", "dialog"],
    ["Alert Dialog", "프로젝트 삭제", "alertdialog"],
  ] as const) {
    await nav.getByRole("button", { name: component, exact: true }).click();
    await page.getByRole("button", { name: trigger, exact: true }).click();
    await expect(page.getByRole(role)).toBeVisible();
    await expect(page.locator(".rbx-backdrop")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".rbx-backdrop")).toHaveCount(0);
  }
});
