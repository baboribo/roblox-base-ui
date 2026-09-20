import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/composition.html");
});
test("Tailwind utilities override component defaults without important", async ({
  page,
}) => {
  const button = page.getByRole("button", { name: "Override", exact: true });
  await expect(button).toHaveCSS("height", "64px");
  await expect(button).toHaveCSS("width", "160px");
  await expect(button).toHaveCSS("border-radius", "0px");
  await expect(page.getByRole("button", { name: "Icon override" })).toHaveCSS(
    "width",
    "64px",
  );
});
test("decorated and plain inputs have the same outer size contract", async ({
  page,
}) => {
  const plain = await page
    .getByRole("textbox", { name: "Plain", exact: true })
    .boundingBox();
  const decorated = await page.locator(".rbx-input-group").boundingBox();
  expect(decorated!.width).toBe(plain!.width);
  expect(decorated!.height).toBe(plain!.height);
});
test("card children retain intrinsic badge and action sizes", async ({
  page,
}) => {
  expect((await page.locator(".rbx-badge").boundingBox())!.width).toBeLessThan(
    100,
  );
  expect(
    (await page
      .getByRole("button", { name: "저장", exact: true })
      .boundingBox())!.width,
  ).toBeLessThan(100);
  await expect(
    page.getByRole("button", { name: "추가", exact: true }),
  ).toHaveCSS("width", "48px");
});
test("input gives space to the adjacent action instead of crushing its label", async ({
  page,
}) => {
  const button = page.getByRole("button", { name: "검색하기" });
  await expect(button).toHaveCSS("height", "48px");
  expect((await button.boundingBox())!.width).toBeGreaterThan(75);
});
test("disabled field does not multiply opacity across parent and input", async ({
  page,
}) => {
  const alpha = await page
    .getByRole("textbox", { name: "비활성" })
    .evaluate((el) => {
      let a = 1;
      for (let e: Element | null = el; e; e = e.parentElement)
        a *= Number(getComputedStyle(e).opacity);
      return a;
    });
  expect(alpha).toBe(0.5);
});
test("loading another component never changes the standalone Menu recipe", async ({
  page,
}) => {
  await page.goto("/isolated.html");
  const trigger = page.getByRole("button", { name: "Menu only" });
  await expect(trigger).toHaveCSS("height", "48px");
  const before = await trigger.boundingBox();
  await page.getByRole("button", { name: "Load unrelated Button" }).click();
  await expect(
    page.getByRole("button", { name: "Load unrelated Button" }),
  ).toHaveAttribute("data-loaded", "true");
  await expect(trigger).toHaveCSS("height", `${before!.height}px`);
  await expect(trigger).toHaveCSS("font-size", "16px");
});
test("the composed settings screen adapts to its parent and retains complete actions", async ({
  page,
}) => {
  await page.goto("/composition.html?screen");
  for (const theme of ["light", "dark"]) {
    await page.evaluate(
      (t) => (document.documentElement.dataset.theme = t),
      theme,
    );
    for (const width of [200, 320, 640]) {
      await page
        .getByRole("button", { name: `${width}px`, exact: true })
        .click();
      const card = page.locator(".rbx-card");
      const bounds = (await card.boundingBox())!;
      for (const control of await card
        .locator(".rbx-input,button,.rbx-badge")
        .all()) {
        const rect = (await control.boundingBox())!;
        expect(rect.x).toBeGreaterThanOrEqual(bounds.x);
        expect(rect.x + rect.width).toBeLessThanOrEqual(
          bounds.x + bounds.width + 1,
        );
      }
      await expect(
        page.getByRole("button", { name: "저장", exact: true }),
      ).toHaveCSS("height", "48px");
      const fields = page.locator(".rbx-grid > *");
      const a = (await fields.nth(0).boundingBox())!;
      const b = (await fields.nth(1).boundingBox())!;
      if (width === 640) expect(Math.abs(a.y - b.y)).toBeLessThan(1);
      else expect(b.y).toBeGreaterThan(a.y + a.height);
      await page.screenshot({
        path: test.info().outputPath(`settings-${theme}-${width}.png`),
        fullPage: true,
      });
    }
  }
  await page
    .getByRole("textbox", { name: "구성원 이메일" })
    .fill("new@example.com");
  await page.getByRole("button", { name: "추가", exact: true }).click();
  await expect(page.getByLabel("구성원", { exact: true })).toContainText(
    "new@example.com",
  );
  await page.getByRole("button", { name: "저장", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("홈 화면 개편");
});
