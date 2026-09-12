import { test, expect } from "@playwright/test";

test("docs sidebar uses 500ms for desktop collapse and expansion", async ({
  page,
}) => {
  await page.goto("/docs/components/alert-dialog");
  const sidebar = page.locator("#nd-sidebar");
  await page.getByRole("button", { name: "탐색 접기", exact: true }).click();
  await expect(sidebar).toHaveAttribute("data-collapsed", "true");
  await expect(sidebar).toHaveCSS("transition-duration", "0.5s");
  await expect(page.locator("#nd-notebook-layout")).toHaveCSS(
    "transition-duration",
    "0.5s",
  );
  await page
    .getByRole("navigation", { name: "문서 도구" })
    .getByRole("button", { name: "탐색 접기", exact: true })
    .click();
  await expect(sidebar).toHaveAttribute("data-collapsed", "false");
  await expect(sidebar).toHaveCSS("transition-duration", "0.5s");
  await expect(sidebar).toHaveCSS(
    "transition-timing-function",
    "cubic-bezier(0.2, 0, 0, 1)",
  );
});

test("docs mobile navigation animates in and out for 500ms", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs");
  await page.getByRole("button", { name: "탐색 열기", exact: true }).click();
  const sidebar = page.locator("#nd-sidebar-mobile");
  await expect(sidebar).toHaveCSS("animation-duration", "0.5s");
  await expect(sidebar).toHaveAttribute("data-state", "open");
  await sidebar.getByRole("button", { name: "탐색 닫기", exact: true }).click();
  await expect(sidebar).toHaveAttribute("data-state", "closed");
  await expect(sidebar).toHaveCSS("animation-duration", "0.5s");
  await expect(sidebar).toBeHidden();
});

test("kit sidebar keeps its slide, 500ms exit, and focus return", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/preview/sidebar-responsive");
  const trigger = page.getByRole("button", { name: "예제 탐색 열기" });
  await trigger.click();
  const sidebar = page.locator(".rbx-sidebar-popup");
  await expect(sidebar).toHaveCSS("transition-duration", "0.5s");
  await expect(sidebar).toHaveCSS("transform", "none");
  await page.keyboard.press("Escape");
  await expect(sidebar).toHaveAttribute("data-ending-style", "");
  await expect(sidebar).toHaveCSS("transition-duration", "0.5s");
  await expect(sidebar).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

for (const [name, triggerName, closeName, selector, duration] of [
  ["dialog", "프로젝트 편집", "취소", ".rbx-dialog", "0.3s, 0.3s"],
  ["alert-dialog", "프로젝트 삭제", "취소", ".rbx-dialog", "0.3s, 0.3s"],
  ["drawer", "상세 패널 열기", "닫기", ".rbx-drawer", "0.3s"],
] as const) {
  test(`${name} enters smoothly and releases the modal on close`, async ({
    page,
  }) => {
    await page.goto(`/preview/${name}`);
    const trigger = page.getByRole("button", {
      name: triggerName,
      exact: true,
    });
    await trigger.click();
    const popup = page.locator(selector);
    await expect(popup).toHaveCSS("transition-duration", duration);
    if (name !== "drawer") {
      await expect(popup).toHaveCSS("scale", /^(1|none)$/);
      const box = (await popup.boundingBox())!;
      expect(Math.abs(box.x + box.width / 2 - 720)).toBeLessThan(1);
    }
    await popup.getByRole("button", { name: closeName, exact: true }).click();
    await expect(popup).toHaveCount(0);
    await expect(page.locator(".rbx-backdrop")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}

test("accordion and collapsible animate measured height without clipping content", async ({
  page,
}) => {
  for (const [name, label] of [
    ["accordion", "소스를 직접 수정할 수 있나요?"],
    ["collapsible", "세부 설정 펼치기"],
  ]) {
    await page.goto(`/preview/${name}`);
    const trigger = page.getByRole("button", { name: label });
    for (let i = 0; i < 2; i++) {
      await trigger.click();
      const panel = page.locator(
        `#${await trigger.getAttribute("aria-controls")}`,
      );
      await expect(panel).toHaveCSS("opacity", "1");
      await expect(panel).toHaveCSS("transition-duration", "0.2s, 0.2s, 0.2s");
      await expect
        .poll(() =>
          panel.evaluate((el) => el.clientHeight >= el.scrollHeight - 1),
        )
        .toBe(true);
      await trigger.click();
      await expect(panel).toBeHidden();
    }
  }
});

test("popup and tooltip motion disappears under reduced motion", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/preview/menu");
    await page.getByRole("button", { name: "프로젝트 메뉴" }).click();
    await expect(page.locator(".rbx-popup")).toHaveCSS(
      "transition-duration",
      reducedMotion === "reduce" ? "0s" : "0.2s, 0.2s",
    );
    await page.keyboard.press("Escape");
    await expect(page.locator(".rbx-popup")).toHaveCount(0);
    await page.goto("/preview/tooltip");
    await page.getByRole("button", { name: "도움말" }).hover();
    await expect(page.locator(".rbx-tooltip")).toHaveCSS(
      "transition-duration",
      reducedMotion === "reduce" ? "0s" : "0.1s, 0.1s",
    );
    await page.mouse.move(1, 1);
    await expect(page.locator(".rbx-tooltip")).toHaveCount(0);
  }
});
