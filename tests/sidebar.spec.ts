import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const mainNav = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "주요 탐색" });

test("desktop sidebar preserves measured geometry, link semantics and independent scrolling", async ({
  page,
}) => {
  await page.goto("/#default-web");
  const panel = page.getByRole("complementary", { name: "BLOCK/UI 탐색" });
  const home = mainNav(page).getByRole("link", {
    name: "Default 웹",
    exact: true,
  });
  await expect(home).toHaveAttribute("aria-current", "page");
  await expect(home).toHaveAttribute("href", "#default-web");
  expect(await panel.evaluate((el) => el.getBoundingClientRect().width)).toBe(
    289,
  );
  expect(
    await home.evaluate((el) => {
      const s = getComputedStyle(el);
      const icon = el.querySelector(".rbx-icon")!;
      return {
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
        radius: s.borderRadius,
        size: s.fontSize,
        weight: s.fontWeight,
        line: s.lineHeight,
        icon: icon.getBoundingClientRect().width,
        background: s.backgroundColor,
      };
    }),
  ).toEqual({
    width: 256,
    height: 40,
    radius: "8px",
    size: "16px",
    weight: "700",
    line: "22.4px",
    icon: 24,
    background: "rgba(208, 217, 251, 0.08)",
  });
  await home.hover();
  await expect
    .poll(() =>
      home.evaluate((el) => getComputedStyle(el, "::before").backgroundColor),
    )
    .not.toBe("rgba(0, 0, 0, 0)");
  await expect(home).not.toHaveAttribute("role", "button");
  const catalog = page.getByRole("navigation", { name: "컴포넌트 목록" });
  await catalog.getByRole("button", { name: "Empty", exact: true }).click();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect(
    await panel.locator(".rbx-sidebar-viewport").evaluate((el) => el.scrollTop),
  ).toBeGreaterThan(0);
  await catalog.getByRole("button", { name: "Sidebar", exact: true }).click();
  await page
    .getByRole("navigation", { name: "예제 탐색" })
    .getByRole("button", { name: "Profile", exact: true })
    .click();
  await expect(
    page.locator(".preview-content").getByRole("status"),
  ).toContainText("선택: Profile");
  await catalog
    .getByRole("button", { name: "Navigation Item", exact: true })
    .click();
  await expect(
    page
      .locator(".preview-content")
      .getByRole("button", { name: "준비 중인 페이지" }),
  ).toBeDisabled();
  await page
    .locator(".preview-content")
    .getByRole("link", { name: "출처 문서로 이동" })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#sources$/);
});

test("mobile navigation traps focus, closes safely, filters and navigates using the same components", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#default-web");
  const trigger = page.getByRole("button", { name: "탐색 열기", exact: true });
  const dialog = page.getByRole("dialog", { name: "BLOCK/UI 탐색" });
  await expect(
    page.getByRole("textbox", { name: "컴포넌트 검색" }),
  ).toHaveCount(0);
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "탐색 닫기" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole("textbox", { name: "컴포넌트 검색" }).fill("sidebar");
  const catalog = page.getByRole("navigation", { name: "컴포넌트 목록" });
  await expect(catalog.getByRole("button")).toHaveCount(1);
  await catalog.getByRole("button", { name: "Sidebar", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Sidebar",
  );
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(
    page.getByRole("textbox", { name: "컴포넌트 검색" }),
  ).toHaveValue("sidebar");
  await page
    .getByRole("textbox", { name: "컴포넌트 검색" })
    .fill("zzzz-no-result");
  await expect(catalog.getByRole("status")).toHaveText("검색 결과가 없습니다.");
  await dialog.getByRole("button", { name: "탐색 닫기" }).click();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .locator(".rbx-sidebar-backdrop")
    .click({ position: { x: 370, y: 400 } });
  await expect(dialog).toBeHidden();
  await trigger.click();
  await page.setViewportSize({ width: 1141, height: 900 });
  await expect(dialog).toHaveCount(0);
  await expect(mainNav(page)).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "컴포넌트 검색" }),
  ).toHaveCount(1);
  await page.setViewportSize({ width: 1140, height: 900 });
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("sidebar is accessible in both themes, respects RTL and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#default-web");
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "라이트 테마로 전환" }).click();
    await page.getByRole("button", { name: "탐색 열기", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(
      await page
        .locator(".rbx-sidebar-popup")
        .evaluate((el) => getComputedStyle(el).transitionDuration),
    ).toBe("0s");
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.screenshot({
      path: test.info().outputPath(`sidebar-mobile-${theme}.png`),
    });
    await page.keyboard.press("Escape");
  }
  await page.evaluate(() => (document.documentElement.dir = "rtl"));
  await page.getByRole("button", { name: "탐색 열기", exact: true }).click();
  const popup = page.locator(".rbx-sidebar-popup");
  expect(await popup.evaluate((el) => el.getBoundingClientRect().right)).toBe(
    390,
  );
  expect(
    await mainNav(page)
      .getByRole("link", { name: "Default 웹", exact: true })
      .evaluate((el) => {
        const icon = el
          .querySelector(".rbx-navigation-item-leading")!
          .getBoundingClientRect();
        const text = el
          .querySelector(".rbx-navigation-item-label")!
          .getBoundingClientRect();
        return icon.left > text.right;
      }),
  ).toBe(true);
});
