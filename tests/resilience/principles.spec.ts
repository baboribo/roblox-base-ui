import { test, expect, type Locator } from "@playwright/test";

test.use({ reducedMotion: "reduce" });
async function insideViewport(target: Locator, width: number, height: number) {
  const box = (await target.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
}
for (const size of ["sm", "md", "lg"]) {
  test(`dialog ${size}: long content stays reachable after resize and nested selection`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    await page.goto(`/principles.html?case=dialog&size=${size}`);
    const trigger = page.getByRole("button", { name: "프로젝트 편집" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await insideViewport(dialog, 320, 480);
    const name = dialog.getByRole("textbox", { name: "프로젝트 이름" });
    await name.fill("수정한 이름");
    const select = dialog.getByRole("combobox");
    await select.click();
    await expect(page.locator(".rbx-attached-popup")).toBeFocused();
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    await expect(select).toContainText("작업 공간 30");
    await page.setViewportSize({ width: 320, height: 240 });
    await insideViewport(dialog, 320, 240);
    await expect(name).toHaveValue("수정한 이름");
    await dialog.getByRole("button", { name: "저장", exact: true }).focus();
    await insideViewport(
      dialog.getByRole("button", { name: "저장", exact: true }),
      320,
      240,
    );
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("수정한 이름");
    await expect(trigger).toBeFocused();
  });
}
for (const [kind, trigger, close, role] of [
  ["alert", "삭제 확인 열기", "삭제 취소", "alertdialog"],
  ["drawer", "패널 열기", "패널 닫기", "dialog"],
] as const) {
  test(`${kind}: long content and close remain reachable on a low screen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 240 });
    await page.goto(`/principles.html?case=${kind}`);
    await page.getByRole("button", { name: trigger }).click();
    const popup = page.getByRole(role);
    await insideViewport(popup, 320, 240);
    await popup.getByRole("button", { name: close }).focus();
    await insideViewport(popup.getByRole("button", { name: close }), 320, 240);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: trigger })).toBeFocused();
  });
}
for (const dir of ["ltr", "rtl"]) {
  test(`sidebar ${dir}: long title does not remove close control or navigation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 360 });
    await page.goto(`/principles.html?case=sidebar&dir=${dir}`);
    await page.getByRole("button", { name: "탐색 열기" }).click();
    const close = page.getByRole("button", { name: "탐색 닫기" });
    await insideViewport(close, 320, 360);
    await expect(page.locator(".rbx-sidebar-mobile-title")).toHaveJSProperty(
      "scrollWidth",
      await page
        .locator(".rbx-sidebar-mobile-title")
        .evaluate((el) => el.clientWidth),
    );
    const last = page.getByRole("link").last();
    await last.focus();
    await insideViewport(last, 320, 360);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "탐색 열기" })).toBeFocused();
  });
}
for (const theme of ["light", "dark"]) {
  test(`toast ${theme}: long action and content fit with all controls reachable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 360 });
    await page.goto(`/principles.html?case=toast&theme=${theme}`);
    await page.getByRole("button", { name: "결과 알림" }).click();
    const toast = page.locator(".rbx-toast");
    await insideViewport(toast, 320, 360);
    expect(
      await toast.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    const action = page.getByRole("button", {
      name: "변경한프로젝트의이전설정으로모두되돌리기",
    });
    await action.focus();
    await insideViewport(action, 320, 360);
    await page.keyboard.press("Enter");
    await expect(page.locator("output")).toHaveText("1");
  });
}
test("toast: very long description scrolls within a low screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 240 });
  await page.goto("/principles.html?case=toast&tall");
  await page.getByRole("button", { name: "결과 알림" }).click();
  const toast = page.locator(".rbx-toast");
  await insideViewport(toast, 320, 240);
  const close = page.getByRole("button", { name: "알림 닫기" });
  await close.focus();
  await insideViewport(close, 320, 240);
  await page.keyboard.press("Enter");
  await expect(toast).toHaveCount(0);
});
test("carousel: informational cards do not expose dead buttons", async ({
  page,
}) => {
  await page.goto("/principles.html?case=carousel");
  await expect(page.getByRole("button", { name: /미리보기/ })).toHaveCount(0);
  await page.goto("/principles.html?case=carousel&interactive");
  await page.getByRole("button", { name: /미리보기 0/ }).click();
  await expect(page.locator("output")).toHaveText("0");
});
