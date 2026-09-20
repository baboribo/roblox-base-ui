import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const activeToast = ".rbx-toast:not([data-limited]):not([data-ending-style])";

test("compact centered toast works in both themes and closes", async ({
  page,
}) => {
  for (const theme of ["light", "dark"]) {
    await page.goto(`/preview/toast?theme=${theme}`);
    await page.getByRole("button", { name: "저장 알림 보기" }).click();
    const toast = page.locator(activeToast);
    await expect(toast).toBeVisible();
    await expect(toast).toHaveCSS("opacity", "1");
    await expect(toast).toHaveCSS("transition-duration", "0.3s, 0.3s, 0.3s");
    const rect = (await toast.boundingBox())!;
    expect(rect.height).toBeLessThanOrEqual(60);
    expect(Math.abs(rect.x + rect.width / 2 - 720)).toBeLessThan(2);
    expect(1000 - rect.y - rect.height).toBeCloseTo(24, 0);
    expect(
      (await new AxeBuilder({ page }).include(".rbx-toast-viewport").analyze())
        .violations,
    ).toEqual([]);
    await expect(page.getByRole("button", { name: "알림 닫기" })).toHaveCount(
      0,
    );
    await page.keyboard.press("F6");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(page.locator(".rbx-toast")).toHaveCount(0);
  }
});

test("replacement never stacks or resurrects the previous toast", async ({
  page,
}) => {
  await page.goto("/preview/toast-replace");
  const button = page.getByRole("button", { name: "새 알림 표시" });
  await button.click();
  await expect(page.locator(activeToast)).toHaveCSS("opacity", "1");
  // 200ms 모션이 여러 브라우저 왕복 사이에서 끝나지 않도록 같은 프레임에서 기록합니다.
  await page.evaluate(() => {
    (window as any).replacementMotion = new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const outgoing = document.querySelector(
          ".rbx-toast[data-ending-style]",
        );
        const incoming = document.querySelector(
          ".rbx-toast:not([data-limited]):not([data-ending-style])",
        );
        if (!outgoing || !incoming) return;
        getComputedStyle(outgoing).opacity;
        getComputedStyle(incoming).opacity;
        resolve({
          outgoing: outgoing.getAnimations().length,
          incoming: incoming.getAnimations().length,
          display: getComputedStyle(outgoing).display,
          duration: getComputedStyle(outgoing).transitionDuration,
          inert: outgoing.hasAttribute("inert"),
          hidden: outgoing.getAttribute("aria-hidden"),
        });
        observer.disconnect();
      });
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-ending-style"],
      });
    });
  });
  await button.click();
  const motion = await page.evaluate(() => (window as any).replacementMotion);
  expect(motion.outgoing).toBeGreaterThan(0);
  expect(motion.incoming).toBeGreaterThan(0);
  const outgoing = page.locator(".rbx-toast[data-ending-style]");
  expect(motion).toMatchObject({
    display: "block",
    duration: "0.2s",
    inert: true,
    hidden: "true",
  });
  await expect(outgoing).toHaveCount(0);
  for (let n = 3; n <= 6; n++) {
    await button.click();
    await expect(page.locator(activeToast)).toHaveCount(1);
    await expect(page.locator(activeToast)).toContainText(
      `${n}번째 알림입니다`,
    );
  }
  await expect(page.getByRole("button", { name: "알림 닫기" })).toHaveCount(0);
  await page.keyboard.press("F6");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await expect(page.locator(".rbx-toast")).toHaveCount(0);
});

test("undo restores the item and focus pauses the action timeout", async ({
  page,
}) => {
  await page.goto("/preview/toast-undo");
  await page.getByRole("button", { name: "파일 삭제", exact: true }).click();
  await expect(
    page.getByText("파일이 없습니다.", { exact: true }),
  ).toBeVisible();
  const undo = page.getByRole("button", { name: "실행 취소", exact: true });
  // Base UI supports F6 access to the toast region, then Tab to its action.
  await page.keyboard.press("F6");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(undo).toBeFocused();
  await page.waitForTimeout(10500);
  await expect(undo).toBeVisible();
  await undo.press("Enter");
  await expect(page.getByText("기획안.pdf", { exact: true })).toBeVisible();
  await expect(page.locator(activeToast)).toContainText("파일을 복원했습니다");
});

test("hover pauses the timeout and leaving resumes it", async ({ page }) => {
  await page.goto("/preview/toast");
  await page.getByRole("button", { name: "저장 알림 보기" }).click();
  await page.locator(activeToast).hover();
  await page.waitForTimeout(5200);
  await expect(page.locator(activeToast)).toBeVisible();
  await page.mouse.move(10, 10);
  await expect(page.locator(".rbx-toast")).toHaveCount(0, { timeout: 6000 });
});

test("retry makes a real request and handles failure before succeeding", async ({
  page,
}) => {
  await page.goto("/preview/toast-retry");
  await page.route("**/r/toast.json", (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await page.getByRole("button", { name: "실패 상황 재현" }).click();
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(page.locator(activeToast)).toContainText("불러오지 못했습니다");
  await page.unroute("**/r/toast.json");
  const response = page.waitForResponse(
    (res) => res.url().endsWith("/r/toast.json") && res.ok(),
  );
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await response;
  await expect(page.getByRole("status")).toContainText("toast 컴포넌트");
  await expect(page.locator(activeToast)).toContainText(
    "컴포넌트를 불러왔습니다",
  );
});

test("change opens a dialog, updates location, and returns focus", async ({
  page,
}) => {
  await page.goto("/preview/toast-change");
  const move = page.getByRole("button", {
    name: "보관함으로 이동",
    exact: true,
  });
  await move.click();
  await page.getByRole("button", { name: "변경", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "이동 위치 변경", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "작업 폴더", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "이동 위치 변경", exact: true }),
  ).toBeHidden();
  await expect(page.getByRole("status")).toContainText("작업 폴더");
  await expect(move).toBeFocused();
});

test("description and action fit narrow screens; reduced motion removes transitions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [example, button] of [
    ["toast-description", "설명이 있는 알림 보기"],
    ["toast-undo", "파일 삭제"],
  ]) {
    await page.goto(`/preview/${example}`);
    await page.getByRole("button", { name: button, exact: true }).click();
    const toast = page.locator(activeToast);
    await expect(toast).toBeVisible();
    await expect(toast).toHaveCSS("transition-duration", "0s");
    const rect = (await toast.boundingBox())!;
    expect(rect.x).toBeGreaterThanOrEqual(16);
    expect(rect.x + rect.width).toBeLessThanOrEqual(304);
    expect(rect.y).toBeGreaterThan(0);
    if (example === "toast-undo") expect(rect.height).toBeLessThanOrEqual(60);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "알림 닫기" }).click();
    await expect(page.locator(".rbx-toast")).toHaveCount(0);
  }
});

test("motion comparison replays token curves and respects reduced motion", async ({
  page,
}) => {
  await page.goto("/docs/motion");
  const frame = page.frameLocator('iframe[title="motion 예제"]');
  await frame.getByLabel("재생 시간").selectOption("1000");
  await frame.getByRole("button", { name: "다시 재생" }).click();
  await expect(frame.locator(".motion-demo-track span").first()).toHaveCSS(
    "animation-duration",
    "1s",
  );
  await expect(frame.locator(".motion-demo-track span").first()).toHaveCSS(
    "animation-timing-function",
    "cubic-bezier(0.2, 0, 0, 1)",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await frame.getByRole("button", { name: "다시 재생" }).click();
  await expect(frame.locator(".motion-demo-track span").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("automatic timeout animates opacity and scale before removing the toast", async ({
  page,
}) => {
  await page.goto("/preview/toast");
  // Observe the exit in the page so a short animation cannot slip between test commands.
  await page.evaluate(() => {
    (window as any).toastExit = new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const toast = document.querySelector(".rbx-toast[data-ending-style]");
        if (!toast) return;
        observer.disconnect();
        setTimeout(() => {
          const style = getComputedStyle(toast);
          resolve({
            connected: toast.isConnected,
            opacity: Number(style.opacity),
            scale: Number(style.scale),
            animations: toast.getAnimations().length,
          });
        }, 80);
      });
      observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ["data-ending-style"],
      });
    });
  });
  await page.getByRole("button", { name: "저장 알림 보기" }).click();
  const exit = await page.evaluate(() => (window as any).toastExit);
  expect(exit.connected).toBe(true);
  expect(exit.opacity).toBeGreaterThan(0);
  expect(exit.opacity).toBeLessThan(1);
  expect(exit.scale).toBeGreaterThan(0.975);
  expect(exit.scale).toBeLessThan(1);
  expect(exit.animations).toBeGreaterThan(0);
  await expect(page.locator(".rbx-toast")).toHaveCount(0);
});
