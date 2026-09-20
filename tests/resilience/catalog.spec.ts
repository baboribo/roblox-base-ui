import { test, expect } from "@playwright/test";
import { exampleNames } from "../../examples/names";
for (const theme of ["light", "dark"]) {
  test(`all examples fit a narrow page in ${theme} without document-level horizontal overflow`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 320, height: 480 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const failures: object[] = [];
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/catalog.html?name=accordion&theme=${theme}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator('main[data-example="accordion"]')).toBeVisible();
    for (const name of exampleNames) {
      await page.evaluate(
        ({ name, theme }) =>
          window.dispatchEvent(
            new CustomEvent("ply-audit-example", { detail: { name, theme } }),
          ),
        { name, theme },
      );
      await expect(page.locator(`main[data-example="${name}"]`)).toBeVisible();
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      const overflow = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        offenders: [...document.querySelectorAll("main *")]
          .filter((el) => el.getBoundingClientRect().right > innerWidth + 1)
          .slice(0, 8)
          .map((el) => ({
            tag: el.tagName,
            class: el.className,
            width: el.getBoundingClientRect().width,
          })),
      }));
      if (overflow.width > 321) failures.push({ name, ...overflow });
    }
    await testInfo.attach("overflow-audit", {
      body: JSON.stringify({ failures, errors }, null, 2),
      contentType: "application/json",
    });
    expect(errors).toEqual([]);
    expect(failures).toEqual([]);
  });
}
