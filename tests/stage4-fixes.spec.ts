import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// 4단계(높음) 회귀 검사: GAME-DISCOVERY-AUDIT H1~H5, SCREENS-AUDIT-2 2-H1·2-H2, COMPOSITION-REVIEW N5·N11.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("typography tokens fall back to system sans-serif and Korean fonts", async ({
  page,
}) => {
  await page.goto("/preview/alert");
  const family = await page
    .locator(".rbx-alert-title")
    .evaluate((element) => getComputedStyle(element).fontFamily);
  expect(family).toContain("Builder Sans");
  expect(family).toContain("Malgun Gothic");
  expect(family).toMatch(/sans-serif$/);
  expect(family).not.toMatch(/(^|,)\s*serif/);
});

test("Korean text breaks between words, not inside them", async ({ page }) => {
  await page.goto("/preview/alert");
  await expect(page.locator(".rbx-alert-description")).toHaveCSS(
    "word-break",
    "keep-all",
  );
});

test("Alert role follows tone and the title level can change", async ({
  page,
}) => {
  await page.goto("/preview/alert-tones");
  await expect(page.locator('.rbx-alert[data-tone="error"]')).toHaveAttribute(
    "role",
    "alert",
  );
  for (const tone of ["success", "warning"])
    await expect(
      page.locator(`.rbx-alert[data-tone="${tone}"]`),
    ).toHaveAttribute("role", "status");
  await expect(page.locator(".rbx-alert-title").first()).toHaveJSProperty(
    "tagName",
    "H3",
  );
  for (const theme of ["light", "dark"]) {
    await page.goto(`/preview/alert-tones?theme=${theme}`);
    // 미리보기 페이지에는 위 제목이 없어 h3가 첫 제목이 됩니다. 제목 순서는 사용하는 화면에서 정합니다.
    const result = await new AxeBuilder({ page })
      .disableRules(["heading-order"])
      .analyze();
    expect(result.violations.map((v) => v.id)).toEqual([]);
  }
});

test("alert buttons and field errors meet AA contrast in both themes", async ({
  page,
}) => {
  for (const name of ["button-alert", "alert-dialog-final-focus"])
    for (const theme of ["light", "dark"]) {
      await page.goto(`/preview/${name}?theme=${theme}`);
      const result = await new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          name,
          theme,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  await page.goto("/preview/dialog-initial-focus?theme=light");
  await page.getByRole("button", { name: "이름 바꾸기" }).click();
  const input = page.getByRole("textbox", { name: "새 이름" });
  // 입력 대화상자는 닫기 버튼이 아니라 입력칸에 첫 포커스가 갑니다.
  await expect(input).toBeFocused();
  await input.fill("");
  await page.getByRole("button", { name: "저장" }).click();
  await expect(page.getByText("이름을 입력하세요.")).toBeVisible();
  for (const theme of ["light", "dark"]) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    const result = await new AxeBuilder({ page })
      .include(".rbx-dialog")
      .withRules(["color-contrast"])
      .analyze();
    expect(result.violations.map((v) => v.nodes.map((n) => n.target))).toEqual(
      [],
    );
  }
});

test("deleting the item that opened the confirm moves focus to a remaining control", async ({
  page,
}) => {
  await page.goto("/preview/alert-dialog-final-focus");
  await page.getByRole("button", { name: "건축 아이디어 삭제" }).click();
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "삭제", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "건축 아이디어 삭제" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "목록 되돌리기" }),
  ).toBeFocused();
});

test("Carousel items can be links named by a visible heading", async ({
  page,
}) => {
  await page.goto("/preview/carousel-links");
  const region = page.getByRole("region", { name: "문서 바로가기" });
  await expect(region).toHaveCount(1);
  await expect(region).toHaveAttribute("aria-labelledby", /.+/);
  await expect(region.getByRole("link")).toHaveCount(3);
  await expect(
    region.getByRole("link", { name: /디자인 토큰/ }),
  ).toHaveAttribute("href", "/docs/foundations");
  // 링크 항목이 있으면 스크롤 영역이 이름 없는 Tab 정지점이 되지 않습니다.
  await page.keyboard.press("Tab");
  await expect(region.getByRole("link").first()).toBeFocused();
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations.map((v) => v.id)).toEqual([]);
});

test("Button rendered with an href stays a link", async ({ page }) => {
  await page.goto("/preview/button-as-link");
  const link = page.getByRole("link", { name: "설치 안내 보기" });
  await expect(link).toHaveAttribute("href", "/docs/installation");
  await expect(link).not.toHaveAttribute("role", /.*/);
  await expect(link).toHaveClass(/rbx-button/);
  await expect(link).toHaveAttribute("data-variant", "standard");
  await expect(page.getByRole("button")).toHaveCount(0);
});
