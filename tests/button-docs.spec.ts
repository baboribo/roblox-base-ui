import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("button variants expose focused previews and matching copyable code", async ({
  page,
}) => {
  await page.goto("/docs/components/button");
  const variants = [
    "emphasis",
    "standard",
    "soft-emphasis",
    "sub-emphasis",
    "subtle",
    "utility",
    "over-media",
    "alert",
    "link",
  ];
  for (const variant of variants) {
    const card = page.locator(`[data-example="button-${variant}"]`);
    await card.scrollIntoViewIfNeeded();
    const frame = card.locator("iframe").contentFrame();
    await expect(frame.getByRole("button")).toHaveCount(1);
    await expect(frame.getByRole("button")).toHaveAttribute(
      "data-variant",
      variant,
    );
    await card.getByRole("tab", { name: "코드", exact: true }).click();
    await expect(card.locator("pre")).toContainText(`variant="${variant}"`);
    await expect(card.locator("iframe")).toBeHidden();
    await card.getByRole("tab", { name: "미리보기" }).click();
    await expect(card.locator("iframe")).toBeVisible();
  }
  const sizes = page.locator('[data-example="button-sizes"]');
  await sizes.scrollIntoViewIfNeeded();
  const frame = sizes.locator("iframe").contentFrame();
  for (const [size, height] of [
    ["xs", 24],
    ["sm", 32],
    ["md", 40],
    ["lg", 48],
  ] as const) {
    await expect(frame.locator(`[data-size="${size}"]`)).toHaveCSS(
      "height",
      `${height}px`,
    );
  }
});

test("example tabs preserve preview state, support keyboard navigation and reset", async ({
  page,
}) => {
  await page.goto("/docs/components/button");
  const card = page.locator('[data-example="button-loading"]');
  await card.scrollIntoViewIfNeeded();
  const frame = card.locator("iframe").contentFrame();
  await frame.getByRole("button", { name: "저장", exact: true }).click();
  await expect(frame.getByRole("status")).toHaveText("저장했습니다.");
  const preview = card.getByRole("tab", { name: "미리보기" });
  await preview.focus();
  await page.keyboard.press("ArrowRight");
  const code = card.getByRole("tab", { name: "코드", exact: true });
  await expect(code).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(card.locator("pre")).toBeVisible();
  await preview.click();
  await expect(frame.getByRole("status")).toHaveText("저장했습니다.");
  await card.getByRole("button", { name: "예제 초기화" }).click();
  await expect(frame.getByRole("status")).toBeEmpty();
});

test("example card and code remain accessible on mobile in both themes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/button");
  const card = page.locator('[data-example="button"]');
  for (const theme of ["light", "dark"]) {
    if (theme === "dark") {
      await page.evaluate(() => {
        localStorage.setItem("theme", "dark");
      });
      await page.reload();
    }
    await expect(card).toHaveAttribute("data-theme", theme);
    for (const name of ["미리보기", "코드"]) {
      await card.getByRole("tab", { name, exact: true }).click();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      const result = await new AxeBuilder({ page })
        .include('[data-example="button"]')
        .analyze();
      expect(result.violations).toEqual([]);
    }
  }
});
