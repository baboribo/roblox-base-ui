import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import catalog from "../tokens/catalog.json" with { type: "json" };
async function choose(page: import("@playwright/test").Page, name: string) {
  await page.goto(
    "/preview/" + name.toLowerCase().replaceAll(" ", "-") + "?theme=dark",
  );
}

test("every component renders without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (const entry of catalog) {
    const name = entry.name
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    await choose(page, name);
    await expect(
      page.locator('.preview-content [class*="rbx-"]').first(),
    ).toBeAttached();
  }
  expect(errors).toEqual([]);
});
test("modal save, focus return, select keyboard, controls and form validation", async ({
  page,
}) => {
  await choose(page, "Dialog");
  const trigger = page.getByRole("button", {
    name: "프로젝트 편집",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("textbox", { name: "프로젝트 이름" }).fill("나의 세계");
  await page.getByRole("button", { name: "변경사항 저장" }).click();
  await expect(
    page.locator(".preview-content").getByRole("status"),
  ).toContainText("나의 세계");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
  await choose(page, "Select");
  const select = page.locator(".preview-content").getByRole("combobox");
  await select.focus();
  await page.keyboard.press("Space");
  await page.getByRole("option", { name: "친구만" }).click();
  await expect(select).toContainText("친구만");
  await choose(page, "Combobox");
  await page.locator(".preview-content").getByRole("combobox").fill("Rac");
  await page.getByRole("option", { name: "Racing" }).click();
  await expect(
    page.locator(".preview-content").getByRole("combobox"),
  ).toHaveValue("Racing");
  await choose(page, "Switch");
  await expect(
    page.locator(".preview-content").getByRole("switch"),
  ).toBeChecked();
  await page.locator(".preview-content").getByRole("switch").click();
  await expect(
    page.locator(".preview-content").getByRole("switch"),
  ).not.toBeChecked();
  await choose(page, "Slider");
  const slider = page.getByRole("slider");
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveAttribute("aria-valuenow", "66");
  await choose(page, "Form");
  await page.getByRole("button", { name: "저장하기", exact: true }).click();
  await expect(
    page.getByText("이메일을 입력하세요.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "연락 이메일" })
    .fill("builder@example.com");
  await page.getByRole("button", { name: "저장하기", exact: true }).click();
  await expect(
    page.locator(".preview-content").getByRole("status"),
  ).toContainText("저장했습니다");
});
test("overlays and navigation work", async ({ page }) => {
  await choose(page, "Menu");
  await page.getByRole("button", { name: "프로젝트 메뉴" }).click();
  await page.getByRole("menuitem", { name: "복제", exact: true }).click();
  await expect(
    page.locator(".preview-content").getByRole("status"),
  ).toContainText("복제");
  await choose(page, "Alert Dialog");
  await page
    .getByRole("button", { name: "프로젝트 삭제", exact: true })
    .click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "삭제 확인" }).click();
  await expect(
    page.locator(".preview-content").getByRole("status"),
  ).toContainText("삭제했습니다");
  await choose(page, "Drawer");
  await page.getByRole("button", { name: "상세 패널 열기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await choose(page, "Popover");
  await page.getByRole("button", { name: "알림 확인" }).click();
  await expect(
    page.getByText("모두 확인했습니다", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await choose(page, "Tabs");
  await page.getByRole("tab", { name: "설정", exact: true }).click();
  await expect(
    page.getByText("프로젝트 설정입니다.", { exact: true }),
  ).toBeVisible();
  await choose(page, "Toast");
  await page.getByRole("button", { name: "알림 띄우기" }).click();
  await expect(
    page.getByText("변경사항을 저장했습니다", { exact: true }),
  ).toBeVisible();
  await page.locator(".rbx-toast-viewport").hover();
  await page.getByRole("button", { name: "알림 닫기" }).click();
});
test("input labels, ARIA relationships and control navigation remain accessible", async ({
  page,
}) => {
  for (const name of [
    "Checkbox",
    "Radio",
    "Select",
    "Combobox",
    "Number Field",
    "Otp Field",
    "Tabs",
    "Progress",
    "Meter",
    "Navigation Menu",
    "Toast",
  ]) {
    await choose(page, name);
    // Exact source alert foreground is retained; explicit enhanced contrast is tested separately.
    const result = await new AxeBuilder({ page })
      .exclude('[data-variant="alert"]')
      .exclude('[data-variant="link"]')
      .analyze();
    expect(
      result.violations.map((v) => ({
        name,
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  await choose(page, "Number Field");
  await page.getByRole("button", { name: "인원 늘리기" }).click();
  await expect(
    page.getByRole("textbox", { name: "최대 참여 인원" }),
  ).toHaveValue("9");
  await choose(page, "Otp Field");
  await page
    .getByRole("textbox", { name: "인증 코드", exact: true })
    .fill("123456");
  await expect(
    page.getByRole("textbox", { name: "코드 6번째 자리" }),
  ).toHaveValue("6");
});
