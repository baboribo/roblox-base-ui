import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });
test("loading preserves names, footprint, focus and blocks repeated activation", async ({
  page,
}) => {
  await page.goto("/?case=loading&width=320");
  const save = page.getByRole("button", { name: "Save project" });
  await save.focus();
  const before = (await save.boundingBox())!;
  await page.keyboard.press("Enter");
  await expect(save).toBeFocused();
  await expect(save).toBeDisabled();
  await page.keyboard.press("Enter");
  await expect(page.locator("output")).toHaveText("1");
  expect((await save.boundingBox())!.width).toBeCloseTo(before.width, 0);
  await expect(page.locator("a").first()).toHaveAccessibleName("Open project");
  await expect(page.locator("a").last()).toHaveAccessibleName("Custom link");
});
test("uncontrolled pagination commits a clamped page when total shrinks", async ({
  page,
}) => {
  await page.goto("/?case=paging&width=800");
  const nav = page.getByRole("navigation", {
    name: "페이지 이동",
    exact: true,
  });
  await page.getByRole("button", { name: "Filter" }).click();
  await expect(nav.locator('[aria-current="page"]')).toHaveText("3");
  await expect(page.locator("output")).toHaveText("3");
  await page.getByRole("button", { name: "Filter" }).click();
  await expect(nav.locator('[aria-current="page"]')).toHaveText("3");
});
test("pagination stays on one row in a narrow parent and all controls are reachable", async ({
  page,
}) => {
  await page.goto("/?case=paging&width=200");
  for (const nav of await page.getByRole("navigation").all()) {
    const boxes = await nav
      .getByRole("button")
      .filter({ visible: true })
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().y));
    expect(Math.max(...boxes) - Math.min(...boxes)).toBeLessThan(2);
    const bounds = (await nav.boundingBox())!;
    for (const button of await nav
      .getByRole("button")
      .filter({ visible: true })
      .all()) {
      const box = (await button.boundingBox())!;
      expect(box.x + box.width).toBeLessThanOrEqual(
        bounds.x + bounds.width + 1,
      );
    }
  }
});
test("tooltip descriptions belong to the active trigger including external handles", async ({
  page,
}) => {
  await page.goto("/?case=tips");
  const first = page.getByRole("button", { name: "First tip" }),
    second = page.getByRole("button", { name: "Second tip" });
  await first.focus();
  await expect(first).toHaveAccessibleDescription(
    "Existing description Shared explanation",
  );
  await expect(second).not.toHaveAttribute("aria-describedby", /.+/);
  await second.focus();
  await expect(first).toHaveAccessibleDescription("Existing description");
  await expect(second).toHaveAccessibleDescription("Shared explanation");
  const external = page.getByRole("button", { name: "External tip" });
  await external.focus();
  await expect(external).toHaveAccessibleDescription("External explanation");
  await page.keyboard.press("Escape");
  await expect(external).not.toHaveAttribute("aria-describedby", /.+/);
});
test("an explicit portal theme wins and direction follows its source", async ({
  page,
}) => {
  await page.goto("/?case=portals&width=500");
  await page.getByRole("button", { name: "Override theme" }).click();
  await page.getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveCSS("background-color", "rgb(25, 26, 31)");
  await expect(dialog).toHaveCSS("direction", "rtl");
  expect(
    await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
});
test("a wide anchor and long unbroken menu text respect the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 500 });
  await page.goto("/?case=portals&width=500");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("menu");
  const box = (await menu.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(
    await menu.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
});
test("intrinsic controls fit a 240px parent without hiding their contents", async ({
  page,
}) => {
  await page.goto("/?case=layout&width=240");
  for (const selector of [
    ".rbx-button",
    ".rbx-badge",
    ".rbx-tabs",
    ".rbx-otp",
    ".rbx-list",
  ]) {
    const el = page.locator(selector).first();
    expect(
      await el.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      selector,
    ).toBe(true);
  }
  const toolbar = page.getByRole("toolbar");
  await expect(toolbar).toHaveCSS("overflow-x", "auto");
  await toolbar.getByRole("button").last().focus();
  const last = (await toolbar.getByRole("button").last().boundingBox())!,
    box = (await toolbar.boundingBox())!;
  expect(last.x + last.width).toBeLessThanOrEqual(box.x + box.width + 1);
  expect(
    await page
      .locator("main")
      .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
});
test("table owns horizontal overflow and horizontal scrollbar has horizontal geometry", async ({
  page,
}) => {
  await page.goto("/?case=layout&width=240");
  const table = page.getByRole("table");
  await expect(table.getByRole("columnheader").first()).toHaveCSS(
    "white-space",
    "nowrap",
  );
  const scroller = table.locator("..");
  await expect(scroller).toHaveCSS("overflow-x", "auto");
  expect((await scroller.boundingBox())!.width).toBeLessThanOrEqual(240);
  const captionText = await table.locator("caption").evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return {
      x: range.getBoundingClientRect().x,
      right: range.getBoundingClientRect().right,
    };
  });
  const viewport = (await scroller.boundingBox())!;
  expect(captionText.x).toBeGreaterThanOrEqual(viewport.x);
  expect(captionText.right).toBeLessThanOrEqual(viewport.x + viewport.width);
  const scrollbar = page.locator(".rbx-scrollbar");
  const box = (await scrollbar.boundingBox())!;
  expect(box.width).toBeGreaterThan(100);
  expect(box.height).toBeLessThan(20);
});
test("compact pages support direct entry, invalid input recovery and resize focus", async ({
  page,
}) => {
  await page.goto("/?case=paging&width=800");
  const nav = page.getByRole("navigation", {
    name: "페이지 이동",
    exact: true,
  });
  await nav.locator('[aria-current="page"]').focus();
  await page.locator("main").evaluate((el) => (el.style.width = "200px"));
  const input = nav.getByRole("textbox", { name: "이동할 페이지" });
  await expect(input).toBeFocused();
  await input.fill("2");
  await input.press("Enter");
  await expect(page.locator("output")).toHaveText("2");
  await expect(input).toHaveValue("2");
  await input.fill("not a page");
  await input.press("Enter");
  await expect(input).toHaveValue("2");
  await input.fill("999");
  await input.press("Enter");
  await expect(page.locator("output")).toHaveText("10");
  await page.locator("main").evaluate((el) => (el.style.width = "800px"));
  await expect(nav.locator('[aria-current="page"]')).toBeFocused();
  await expect(nav.locator('[aria-current="page"]')).toHaveText("10");
});
test("controlled tab changes reveal the selected tab and align its indicator after scrolling", async ({
  page,
}) => {
  await page.goto("/?case=layout&width=240");
  await page.getByRole("button", { name: "Select last tab" }).click();
  const selected = page.getByRole("tab", { selected: true }),
    list = page.getByRole("tablist");
  await expect
    .poll(async () => {
      const a = (await selected.boundingBox())!,
        b = (await list.boundingBox())!;
      return a.x >= b.x - 1 && a.x + a.width <= b.x + b.width + 1;
    })
    .toBe(true);
  const a = (await selected.boundingBox())!,
    indicator = (await page.locator(".rbx-tab-indicator").boundingBox())!;
  expect(indicator.x).toBeCloseTo(a.x, 0);
  expect(indicator.width).toBeCloseTo(a.width, 0);
  await selected.press("Home");
  await expect(page.getByRole("tab").first()).toBeFocused();
});
test("vertical tabs use a vertical layout and indicator", async ({ page }) => {
  await page.goto("/?case=layout&width=240&vertical");
  const tabs = page.getByRole("tab");
  const first = (await tabs.first().boundingBox())!,
    second = (await tabs.nth(1).boundingBox())!;
  expect(second.y).toBeGreaterThan(first.y + first.height - 1);
  await tabs.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  const indicator = (await page.locator(".rbx-tab-indicator").boundingBox())!;
  expect(indicator.width).toBe(2);
  expect(indicator.y).toBeCloseTo(second.y, 0);
  expect(indicator.height).toBeCloseTo(second.height, 0);
});
test("zero counts keep the leading and trailing slots instead of bare stray text", async ({
  page,
}) => {
  await page.goto("/?case=details");
  for (const name of ["list", "navigation-item"])
    for (const part of ["leading", "trailing"])
      await expect(page.locator(`.rbx-${name}-${part}`)).toHaveText("0");
});
test("combobox chip removal fits inside the chip and returns space to the input", async ({
  page,
}) => {
  await page.goto("/?case=details");
  const chip = page.locator(".rbx-chips .rbx-badge").first(),
    remove = chip.getByRole("button");
  const a = (await chip.boundingBox())!,
    b = (await remove.boundingBox())!;
  expect(b.height).toBeLessThanOrEqual(24);
  expect(b.y + b.height).toBeLessThanOrEqual(a.y + a.height);
  await remove.click();
  await expect(page.locator(".rbx-chips .rbx-badge")).toHaveCount(1);
  await page.getByRole("combobox").fill("find");
  await expect(page.getByRole("combobox")).toHaveValue("find");
});
test("carousel cards and the next-card distance follow their narrow container", async ({
  page,
}) => {
  await page.goto("/?case=details&width=200");
  const viewport = page.locator(".rbx-carousel-viewport");
  const first = page.locator(".rbx-carousel-item").first();
  expect((await first.boundingBox())!.width).toBeLessThanOrEqual(200);
  await page.getByRole("button", { name: "Next cards" }).click();
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollLeft))
    .toBeCloseTo(212, 0);
  expect(
    await first.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
});
test("tooltip render composition preserves the actual popup ID, children and existing description", async ({
  page,
}) => {
  await page.goto("/?case=tips");
  const trigger = page.getByRole("button", { name: "Rendered trigger" });
  await trigger.focus();
  await expect(trigger).toHaveAccessibleDescription(
    "Existing description Rendered explanation",
  );
  await expect(page.getByRole("tooltip")).toHaveAttribute(
    "id",
    "rendered-description",
  );
});
test("component defaults survive consumers loading the base stylesheet last", async ({
  page,
}) => {
  await page.goto("/?case=order&width=320");
  const button = page.getByRole("button", { name: "Normal button" }),
    textarea = page.getByRole("textbox");
  const height = (await textarea.boundingBox())!.height;
  await page.getByRole("button", { name: "Load theme last" }).click();
  await expect(button).toHaveCSS("height", "48px");
  expect((await textarea.boundingBox())!.height).toBeCloseTo(height, 0);
});
