import { test, expect } from "@playwright/test";

test("checkbox and select use Roblox masks without adding symbols to accessible names", async ({
  page,
}) => {
  await page.goto("/preview/checkbox");
  const checkbox = page.getByRole("checkbox");
  await checkbox.check();
  const check = checkbox.locator('[data-icon="icon-filled-check"]');
  await expect(check).toBeVisible();
  expect(
    await check.evaluate((el) => getComputedStyle(el).maskImage),
  ).toContain("data:image/svg+xml");
  await expect(checkbox).not.toContainText("✓");
  await checkbox.uncheck();
  await expect(check).toBeHidden();
  await page.goto("/preview/select-sm");
  const trigger = page.getByRole("combobox", { name: "공개 범위" });
  await expect(
    trigger.locator('[data-icon="icon-regular-chevron-large-down"]'),
  ).toBeVisible();
  await trigger.click();
  await expect(
    page
      .getByRole("option", { name: "친구만", exact: true })
      .locator('[data-icon="icon-filled-check"]'),
  ).toHaveCount(0);
  await page.getByRole("option", { name: "친구만", exact: true }).click();
  await expect(trigger).toContainText("친구만");
});

test("third-party SVGs share Icon sizing and IconButton preserves its label and action", async ({
  page,
}) => {
  await page.goto("/preview/icon-custom");
  const custom = page.locator(".rbx-icon[data-custom]").first();
  await expect(custom).toHaveCSS("mask-image", "none");
  await expect(custom).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(custom.locator("svg")).toHaveCSS("width", "24px");
  await expect(custom.locator("svg")).toHaveCSS("height", "24px");
  await expect(custom).toHaveAttribute("aria-hidden", "true");
  const button = page.getByRole("button", { name: "수량 줄이기", exact: true });
  await expect(button.locator("svg")).toHaveCSS("width", "20px");
  await button.click();
  await expect(page.getByRole("status")).toHaveText("수량 4");
});

test("minus and remove glyphs remain usable without text symbols", async ({
  page,
}) => {
  await page.goto("/preview/number-field-step");
  await page.getByRole("button", { name: "5 줄이기" }).click();
  await expect(page.getByLabel("음량", { exact: true })).toHaveValue("45");
  await page.getByRole("button", { name: "5 늘리기" }).click();
  await expect(page.getByLabel("음량", { exact: true })).toHaveValue("50");
  await page.goto("/preview/combobox-multiple");
  const remove = page.getByRole("button", { name: "Racing 삭제" });
  await expect(remove.locator('[data-icon="icon-regular-x"]')).toBeVisible();
  await remove.click();
  await expect(remove).toHaveCount(0);
});

test("multi-select checks sit after labels and toggle independently", async ({
  page,
}) => {
  await page.goto("/preview/select-multiple");
  await page.getByRole("combobox", { name: "분야" }).click();
  const operations = page.getByRole("option", { name: "운영", exact: true });
  await operations.click();
  await expect(operations).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("listbox")).toBeVisible();
  const indicator = operations.locator(".rbx-attached-check");
  const optionBox = (await operations.boundingBox())!;
  const indicatorBox = (await indicator.boundingBox())!;
  expect(indicatorBox.x).toBeGreaterThan(optionBox.x + optionBox.width / 2);
  await page.getByRole("option", { name: "개발", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(
    "선택한 분야: 디자인, 운영",
  );
  await expect(
    page.getByRole("option", { name: "개발", exact: true }),
  ).toHaveAttribute("aria-selected", "false");
});

test("checkbox glyphs scale with each control size", async ({ page }) => {
  await page.goto("/preview/checkbox-sizes");
  await expect(page.getByRole("checkbox")).toHaveCount(4);
  for (const checkbox of await page.getByRole("checkbox").all()) {
    const icon = checkbox.locator('[data-icon="icon-filled-check"]');
    const box = (await checkbox.boundingBox())!;
    const glyph = (await icon.boundingBox())!;
    expect(glyph.width).toBeCloseTo(box.width - 2, 0);
    await expect(icon).toHaveCSS("mask-size", "150% auto");
  }
});
