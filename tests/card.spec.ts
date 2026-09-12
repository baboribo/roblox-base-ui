import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("card thumbnails navigate and footer actions remain independent", async ({
  page,
}) => {
  await page.goto("/preview/card-project");
  const media = page.locator(".rbx-card-media");
  const box = await media.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box!.x + 20, box!.y + 20);
  await expect(page).toHaveURL(/\/docs$/);

  await page.goto("/preview/card-actions");
  await page.getByRole("button", { name: "즐겨찾기", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("즐겨찾기에 추가했습니다.");
  await expect(page).toHaveURL(/\/preview\/card-actions$/);
  await page.getByRole("button", { name: "즐겨찾기 해제" }).click();
  await expect(page.getByRole("status")).toBeEmpty();
  const link = page.getByRole("link", { name: "컴포넌트 문서" });
  await page.keyboard.press("Shift+Tab");
  await expect(link).toBeFocused();
  expect(
    await link.evaluate((el) => getComputedStyle(el, "::after").outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/docs$/);
});

test("failed card image keeps its space and recovers after changing src", async ({
  page,
}) => {
  await page.goto("/preview/card-fallback");
  const media = page.locator(".rbx-card-media");
  const before = await media.boundingBox();
  await expect(page.getByText("미리보기를 불러올 수 없습니다")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "문서 화면 미리보기" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "정상 이미지로 교체" }).click();
  await expect(page.locator("img.rbx-card-image")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("img.rbx-card-image")
        .evaluate((el) => (el as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(page.locator(".rbx-card-image-fallback")).toHaveCount(0);
  const after = await media.boundingBox();
  expect(after!.height).toBeCloseTo(before!.height, 1);
});

test("card cases keep image ratios and fit mobile layouts in both themes", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const theme of ["light", "dark"]) {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const name of [
        "card",
        "card-project",
        "card-asset",
        "card-asset-detail",
        "card-asset-select",
        "card-horizontal",
        "card-actions",
        "card-fallback",
        "card-filled",
        "card-compact",
        "card-wide",
      ]) {
        await page.goto(`/preview/${name}?theme=${theme}`);
        await expect(page.locator(".rbx-card")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        if (["card-project", "card-asset", "card-wide"].includes(name)) {
          const box = await page.locator(".rbx-card-media").boundingBox();
          expect(box!.width / box!.height).toBeCloseTo(
            name === "card-asset" ? 1 : name === "card-wide" ? 21 / 9 : 16 / 9,
            2,
          );
          await expect
            .poll(() => page.locator("img").evaluate((el) => el.naturalWidth))
            .toBeGreaterThan(0);
        }
        if (name === "card-asset")
          await expect(page.locator("img")).toHaveCSS("object-fit", "contain");
        if (name === "card-horizontal") {
          const image = await page.locator(".rbx-card-media").boundingBox();
          const content = await page.locator(".rbx-card-content").boundingBox();
          expect(content!.x).toBeGreaterThanOrEqual(
            image!.x + image!.width - 1,
          );
        }
        if (width === 390) {
          const results = await new AxeBuilder({ page }).analyze();
          expect(results.violations, `${name} ${theme}`).toEqual([]);
        }
      }
    }
  }
});

test("asset details open from thumbnail and restore focus when dismissed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const theme of ["light", "dark"]) {
    await page.goto(`/preview/card-asset-detail?theme=${theme}`);
    const trigger = page.getByRole("button", { name: "기본 큐브" });
    const media = await page.locator(".rbx-card-media").boundingBox();
    await page.mouse.click(media!.x + 25, media!.y + 25);
    const dialog = page.getByRole("dialog", { name: "기본 큐브" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "기본 큐브" }),
    ).toBeInViewport();
    await expect(dialog.getByRole("img")).toBeVisible();
    await expect(page.locator(".rbx-backdrop")).toBeVisible();
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "닫기" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await page.keyboard.press("Space");
    await expect(dialog).toBeVisible();
    await page.mouse.click(4, 4);
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
});

test("asset detail preview starts at its title inside a short mobile iframe", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/card");
  const example = page.locator('[data-example="card-asset-detail"]');
  await example.scrollIntoViewIfNeeded();
  const frame = example.locator("iframe").contentFrame();
  await frame.getByRole("button", { name: "기본 큐브" }).click();
  const dialog = frame.getByRole("dialog", { name: "기본 큐브" });
  await expect(dialog).toBeFocused();
  expect(await dialog.evaluate((el) => el.scrollTop)).toBe(0);
  await expect(
    dialog.getByRole("heading", { name: "기본 큐브" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "닫기" }).click();
  await expect(dialog).toBeHidden();
});

test("asset selection adds and removes a real list item", async ({ page }) => {
  await page.goto("/preview/card-asset-select");
  const action = page.getByRole("button", { name: "기본 큐브", exact: true });
  const add = page.getByRole("button", { name: "작업에 추가" });
  await expect(add).toBeDisabled();
  await action.focus();
  await page.keyboard.press("Space");
  await expect(action).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".rbx-card")).toHaveAttribute(
    "data-selected",
    "true",
  );
  await expect(add).toBeEnabled();
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .map((animation) => animation.finished.catch(() => {})),
    ),
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Space");
  await expect(add).toBeDisabled();
  const media = await page.locator(".rbx-card-media").boundingBox();
  await page.mouse.click(media!.x + 25, media!.y + 25);
  await add.click();
  const list = page.getByRole("region", { name: "작업에 추가된 에셋" });
  await expect(list.getByRole("listitem")).toContainText("기본 큐브");
  await expect(action).toHaveAttribute("aria-pressed", "false");
  await list.getByRole("button", { name: "기본 큐브 제거" }).click();
  await expect(list.getByRole("listitem")).toHaveCount(0);
  await expect(list.getByRole("status")).toHaveText("추가된 에셋이 없습니다.");
});
