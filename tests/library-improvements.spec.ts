import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const [triggerName, selector] of [
  ["테마 대화상자", ".rbx-dialog"],
  ["테마 메뉴", ".rbx-popup"],
  ["테마 팝오버", ".rbx-popup"],
]) {
  test(`${triggerName} inherits scoped tokens, live changes and focus return`, async ({
    page,
  }) => {
    await page.goto("/preview/portal-theme?theme=light");
    const boundary = page.getByTestId("theme-boundary");
    const trigger = page.getByRole("button", {
      name: triggerName,
      exact: true,
    });
    await trigger.click();
    const popup = page.locator(selector).filter({ visible: true });
    await expect(popup).toHaveCSS("background-color", "rgb(25, 26, 31)");
    await expect(popup).toHaveCSS("color", "rgb(247, 247, 248)");
    // 실제 앱에서 영역의 data-theme와 사용자 토큰을 갱신하는 상황입니다.
    await boundary.evaluate((el) => {
      el.dataset.theme = "light";
      el.style.setProperty("--rbx-color-surface-100", "rgb(240, 245, 250)");
    });
    await expect(popup).toHaveCSS("background-color", "rgb(240, 245, 250)");
    await expect(popup).toHaveCSS("color", "rgb(32, 34, 39)");
    await boundary.evaluate((el) => {
      el.removeAttribute("data-theme");
      el.style.removeProperty("--rbx-color-surface-100");
    });
    await expect(popup).toHaveCSS("background-color", "rgb(247, 247, 248)");
    await page.keyboard.press("Escape");
    await expect(popup).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}

test("Tooltip arrow shares the tooltip surface and Toast follows its local theme", async ({
  page,
}) => {
  await page.goto("/preview/portal-theme?theme=light");
  const help = page.getByRole("button", { name: "테마 도움말" });
  await help.hover();
  await expect(page.getByRole("tooltip")).toHaveCSS(
    "background-color",
    "rgb(247, 247, 248)",
  );
  await expect(page.locator(".rbx-tooltip-arrow")).toHaveCSS(
    "fill",
    "rgb(247, 247, 248)",
  );
  await expect(help).toHaveAccessibleDescription("프로젝트 설정을 확인하세요.");
  await page.keyboard.press("Escape");
  await expect(help).not.toHaveAttribute("aria-describedby", /.+/);
  await page.mouse.move(0, 0);
  await page.getByRole("button", { name: "테마 알림", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "저장했습니다", exact: true }),
  ).toHaveCSS("color", "rgb(247, 247, 248)");
  await page.getByRole("button", { name: "영역 테마 전환" }).click();
  await expect(
    page.getByRole("dialog", { name: "저장했습니다", exact: true }),
  ).toHaveCSS("color", "rgb(32, 34, 39)");
  await page.getByRole("button", { name: "알림 닫기" }).click();
});

test("Textarea respects rows, native errors, and Input retains a zero adornment", async ({
  page,
}) => {
  await page.goto("/preview/textarea-states");
  const short = page.getByRole("textbox", { name: "짧은 메모" });
  const long = page.getByRole("textbox", { name: "긴 설명" });
  expect((await long.boundingBox())!.height).toBeGreaterThan(
    (await short.boundingBox())!.height + 40,
  );
  const invalid = page.getByRole("textbox", { name: "오류가 있는 소개" });
  await expect(invalid).toHaveCSS("border-color", "rgb(223, 40, 31)");
  await invalid.fill("설명");
  await expect(invalid).toHaveValue("설명");
  await page.goto("/preview/input-adornment-states");
  await expect(page.locator(".rbx-input-adornment")).toHaveText(["0"]);
  await expect(page.locator(".rbx-input-group")).toHaveCSS(
    "border-color",
    "rgb(223, 40, 31)",
  );
});

test("loading Button blocks a second action and Spinner respects reduced motion", async ({
  page,
}) => {
  await page.goto("/preview/button-loading");
  await page.getByRole("button", { name: "저장", exact: true }).click();
  const saving = page.getByRole("button", { name: "저장 중…" });
  await expect(saving).toBeDisabled();
  await expect(saving).toHaveAttribute("aria-busy", "true");
  await expect(saving.locator(".rbx-spinner")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("저장했습니다.");
  await page.goto("/preview/spinner");
  await expect(page.getByRole("status")).toHaveCount(3);
  await expect(page.locator(".rbx-spinner").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("Pagination changes real data, supports keyboard navigation and fits mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/preview/pagination");
  const navigation = page.getByRole("navigation", { name: "페이지 이동" });
  await expect(
    navigation.getByRole("button", { name: "이전 페이지" }),
  ).toBeDisabled();
  await navigation.getByRole("button", { name: "다음 페이지" }).click();
  await expect(
    page
      .getByRole("list", { name: "프로젝트 목록" })
      .getByRole("listitem")
      .first(),
  ).toHaveText("프로젝트 6");
  await expect(
    navigation.getByRole("textbox", { name: "이동할 페이지" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 800, height: 740 });
  await navigation
    .getByRole("button", { name: "20페이지", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(navigation.locator('[aria-current="page"]')).toHaveText("20");
  await expect(
    navigation.getByRole("button", { name: "다음 페이지" }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toHaveText("20 / 20 페이지");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto("/preview/pagination-uncontrolled");
  await page.getByRole("button", { name: "다음 페이지" }).click();
  await expect(page.locator('[aria-current="page"]')).toHaveText("6");
  await page.goto("/preview/pagination-disabled");
  for (const button of await page
    .getByRole("navigation")
    .getByRole("button")
    .all())
    await expect(button).toBeDisabled();
});
