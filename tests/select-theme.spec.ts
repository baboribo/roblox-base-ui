import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function expectSharedSurface(page: Page) {
  const trigger = page.getByRole("combobox");
  const popup = page.locator(".rbx-attached-popup");
  const appearance = await trigger.evaluate((el) => {
    const css = getComputedStyle(el);
    return {
      background: css.backgroundColor,
      color: css.color,
      border: css.borderColor,
    };
  });
  await expect(popup).toHaveCSS("background-color", appearance.background);
  await expect(popup).toHaveCSS("color", appearance.color);
  await expect(popup).toHaveCSS("border-color", appearance.border);
}

for (const theme of ["light", "dark"] as const) {
  test(`${theme} Select keeps its nested theme, shadow and live theme changes across the portal`, async ({
    page,
  }) => {
    const outer = theme === "light" ? "dark" : "light";
    await page.goto(`/preview/select?theme=${outer}`);
    const field = page.locator(".rbx-attached-field");
    await field.evaluate(
      (el, value) => el.setAttribute("data-theme", value),
      theme,
    );
    const trigger = page.getByRole("combobox");
    await trigger.click();
    await expectSharedSurface(page);
    const popup = page.locator(".rbx-attached-popup");
    const shadowColor =
      theme === "dark" ? "rgba(4, 4, 8, 0.25)" : "rgba(0, 0, 0, 0.08)";
    await expect(popup).toHaveCSS(
      "box-shadow",
      new RegExp(shadowColor.replace(/[().]/g, "\\$&")),
    );

    // 목록을 닫지 않고 주변 테마를 바꿔도 색과 그림자가 함께 바뀝니다.
    await field.evaluate(
      (el, value) => el.setAttribute("data-theme", value),
      outer,
    );
    await expectSharedSurface(page);
    await field.evaluate((el) => el.removeAttribute("data-theme"));
    await expectSharedSurface(page);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test(`${theme} open Select keeps an error border and an elevated surface`, async ({
    page,
  }) => {
    await page.goto(`/preview/select-error?theme=${theme}`);
    await page.getByRole("combobox").click();
    await expectSharedSurface(page);
    const appearance = await page
      .locator(".rbx-attached-popup")
      .evaluate((el) => {
        const css = getComputedStyle(el);
        return {
          surface: css.backgroundColor,
          shadow: css.boxShadow,
          page: getComputedStyle(document.body).backgroundColor,
        };
      });
    expect(appearance.surface).not.toBe(appearance.page);
    expect(appearance.shadow).not.toBe("none");
  });
}

test("local token overrides and multi-select badges survive a portal and reopening", async ({
  page,
}) => {
  await page.goto("/preview/select-multiple?theme=light");
  const field = page.locator(".rbx-attached-field");
  await field.evaluate((el) => {
    el.style.setProperty("--rbx-color-surface-200", "rgb(45, 55, 65)");
    el.style.setProperty("--rbx-color-content-emphasis", "rgb(240, 245, 250)");
    el.style.setProperty("--rbx-color-shift-200", "rgb(70, 80, 90)");
  });
  const trigger = page.getByRole("combobox");
  await trigger.click();
  await expectSharedSurface(page);
  await page.getByRole("option", { name: "운영", exact: true }).click();
  await expect(
    page.locator(".rbx-attached-popup .rbx-attached-count"),
  ).toHaveCSS("background-color", "rgb(70, 80, 90)");
  await field.evaluate((el) =>
    el.style.setProperty("--rbx-color-surface-200", "rgb(65, 75, 85)"),
  );
  await expectSharedSurface(page);
  await page.keyboard.press("Escape");
  await field.evaluate((el) => el.removeAttribute("style"));
  await trigger.click();
  await expectSharedSurface(page);
});
