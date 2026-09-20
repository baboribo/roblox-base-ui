import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import measurements from "../tokens/default-web.measurements.json" with { type: "json" };

test("Default Web matches measured Chat, input, dialog and menu properties", async ({
  page,
}) => {
  await page.goto("/preview/settings?theme=dark");
  await page.evaluate(() => document.fonts.ready);
  // Select는 원본 측정 이후 연결형으로 재설계했습니다. 원본 기록은 보존하고 아래에서 새 구조를 검사합니다.
  for (const sample of measurements.samples.filter(
    (item) => item.component !== "Preferences select",
  )) {
    const element = page.locator(sample.localSelector).first();
    for (const [property, value] of Object.entries(sample.css)) {
      // 다중 행 버튼을 지원하며 세로 안쪽 여백만 추가했습니다. 원본 측정값은 보존합니다.
      if (sample.component === "Chat small button" && property === "padding") {
        await expect(element).toHaveCSS("padding", "4px 8px");
        continue;
      }
      await expect(element, `${sample.component}: ${property}`).toHaveCSS(
        property,
        value,
      );
    }
  }
  await page.getByRole("combobox", { name: /표시 모드/ }).click();
  const menu = page.locator(".rbx-attached-popup");
  await expect(menu).toHaveCSS("border-radius", "12px");
  await expect(menu).toHaveCSS("background-color", "rgb(32, 34, 39)");
  const option = page.getByRole("option", { name: "Light", exact: true });
  await expect(option).toHaveCSS("padding", "12px 8px");
  await expect(option).toHaveCSS("font-size", "14px");
  await page.keyboard.press("Escape");
  const trigger = page.getByRole("button", {
    name: "이름 변경",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveCSS("width", "480px");
  await expect(dialog).toHaveCSS("padding", "0px");
  await expect(dialog).toHaveCSS("border-radius", "16px");
  await expect(dialog).toHaveCSS("border-color", "rgba(208, 217, 251, 0.08)");
  await expect(page.locator(".rbx-dialog-body")).toHaveCSS("padding", "20px");
  await expect(page.locator(".rbx-dialog-close-affordance")).toHaveCSS(
    "width",
    "36px",
  );
  await page
    .getByRole("textbox", { name: "표시 이름", exact: true })
    .fill("Local Builder");
  await page.getByRole("button", { name: "저장", exact: true }).click();
  await expect(trigger).toBeFocused();
  await expect(page.getByText("Local Builder", { exact: true })).toBeVisible();
});

test("synthetic Chat search, collapse, group selection and keyboard focus remain local", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") requests.push(request.url());
  });
  await page.goto("/preview/settings?theme=dark");
  await page
    .getByRole("textbox", { name: "Search conversations" })
    .fill("Pixel");
  await expect(page.locator(".rbx-chat-row")).toHaveCount(1);
  await page.getByRole("button", { name: "Collapse Chat" }).click();
  await expect(page.locator(".rbx-chat-panel").first()).toHaveCSS(
    "height",
    "48px",
  );
  await page.getByRole("button", { name: "Expand Chat" }).click();
  await page
    .getByRole("textbox", { name: "Search for connections" })
    .fill("Pixel");
  await page.getByRole("checkbox", { name: /Pixel Builder/ }).check();
  await expect(page.locator(".rbx-chat-count")).toContainText("(1/5)");
  await expect(
    page.getByRole("button", { name: "Create", exact: true }),
  ).toBeDisabled();
  // Create is never clicked; this demo deliberately has no creation callback.
  await page.getByRole("button", { name: "Close group panel" }).click();
  await page
    .getByRole("button", { name: "New Chat Group", exact: true })
    .click();
  await expect(page.locator(".rbx-chat-count")).toContainText("(0/5)");
  expect(requests).toEqual([]);
});

test("Default demo is accessible in both modes and fits mobile", async ({
  page,
}) => {
  await page.goto("/preview/settings?theme=dark");
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.evaluate(() => {
        document.documentElement.dataset.theme = "light";
      });
    await expect(page.locator(".rbx-chat-panel").first()).toHaveCSS(
      "background-color",
      theme === "dark" ? "rgb(25, 26, 31)" : "rgb(247, 247, 248)",
    );
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath("default-web-mobile.png"),
    fullPage: true,
  });
});

test("button size map and explicit enhanced alert contrast are verified", async ({
  page,
}) => {
  await page.goto("/preview/button-overview?theme=dark");
  for (const [size, height, font, radius] of [
    ["xs", "24px", "12px", "4px"],
    ["sm", "32px", "12px", "8px"],
    ["md", "40px", "14px", "8px"],
    ["lg", "48px", "16px", "8px"],
  ]) {
    const button = page.getByRole("button", {
      name: `Size ${size}`,
      exact: true,
    });
    await expect(button).toHaveCSS("height", height);
    await expect(button).toHaveCSS("font-size", font);
    await expect(button).toHaveCSS("border-radius", radius);
  }
  const focus = page.getByRole("button", { name: "Size sm", exact: true });
  await focus.focus();
  await expect(focus).toHaveCSS("outline-width", "3px");
  await expect(focus).toHaveCSS("outline-color", "rgb(255, 255, 255)");
  await page.evaluate(() => {
    document.documentElement.dataset.contrast = "enhanced";
  });
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.evaluate(() => {
        document.documentElement.dataset.theme = "light";
      });
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.locator('[data-variant="over-media"]')).toHaveCSS(
      "background-color",
      theme === "light" ? "rgb(32, 34, 39)" : "rgb(247, 247, 248)",
    );
    // over-media 배경은 이미 최종 색이어도 alert 글자색은 전환 중일 수 있습니다.
    // 접근성 검사는 강화 대비 토큰으로 전환이 끝난 실제 상태에서 실행합니다.
    for (const variant of ["alert", "link"]) {
      const button = page.locator(`.rbx-button[data-variant="${variant}"]`);
      await expect
        .poll(() =>
          button.evaluate((element) => element.getAnimations().length),
        )
        .toBe(0);
    }
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});

test("Robux FAQ spacing, multiple expansion and keyboard behavior match the source pattern", async ({
  page,
}) => {
  await page.goto("/preview/settings?theme=dark");
  const accordion = page.locator(".rbx-accordion");
  await expect(accordion).toHaveCSS("gap", "16px");
  const first = page.getByRole("button", {
    name: "토큰은 어디서 바꾸나요?",
    exact: true,
  });
  await expect(first).toHaveCSS("min-height", "40px");
  await expect(first).toHaveCSS("font-size", "14px");
  await expect(first).toHaveCSS("font-weight", "700");
  await expect(page.locator(".rbx-accordion-item").first()).toHaveCSS(
    "padding",
    "8px 12px",
  );
  await expect(page.locator(".rbx-accordion-item").first()).toHaveCSS(
    "border-radius",
    "8px",
  );
  await expect(page.locator(".rbx-accordion-panel").first()).toHaveCSS(
    "padding-bottom",
    "12px",
  );
  const second = page.getByRole("button", {
    name: "소스를 직접 수정할 수 있나요?",
    exact: true,
  });
  await second.focus();
  await page.keyboard.press("Enter");
  await expect(second).toHaveAttribute("aria-expanded", "true");
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".rbx-accordion-item").first()).toHaveCSS(
    "height",
    "58px",
  );
  await page.setViewportSize({ width: 1100, height: 900 });
  await expect(accordion).toHaveCSS("gap", "12px");
});

test("Account Status meter and card collection work with synthetic data", async ({
  page,
}) => {
  await page.goto("/preview/settings?theme=dark");
  const meter = page.getByRole("meter", { name: "프로젝트 상태" });
  await expect(meter).toHaveAttribute("aria-valuenow", "4");
  await expect(page.locator(".rbx-status-segments")).toHaveCSS("height", "8px");
  await expect(page.locator(".rbx-status-segments")).toHaveCSS("gap", "2px");
  await expect(page.locator(".rbx-status-card")).toHaveCSS("padding", "24px");
  await expect(page.locator(".rbx-status-card")).toHaveCSS(
    "border-radius",
    "16px",
  );
  await page.getByRole("button", { name: "2 / 4", exact: true }).click();
  await expect(meter).toHaveAttribute("aria-valuenow", "2");
  await expect(page.locator(".rbx-status-segments [data-filled]")).toHaveCount(
    2,
  );
  await page.setViewportSize({ width: 900, height: 1000 });
  const next = page.getByRole("button", { name: "Next cards", exact: true });
  await expect(next).toBeEnabled();
  await next.click();
  await expect
    .poll(() =>
      page.locator(".rbx-carousel-viewport").evaluate((el) => el.scrollLeft),
    )
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Previous cards", exact: true })
    .click();
  await expect
    .poll(() =>
      page.locator(".rbx-carousel-viewport").evaluate((el) => el.scrollLeft),
    )
    .toBe(0);
  await expect(page.locator(".rbx-carousel-item").first()).toHaveCSS(
    "width",
    "280px",
  );
  await expect(page.locator(".rbx-carousel-media").first()).toHaveCSS(
    "height",
    "160px",
  );
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("new Foundation Switch uses contrast, checkmark, flex spacers and logical direction", async ({
  page,
}) => {
  await page.goto("/preview/settings?theme=dark");
  const control = page.getByRole("switch");
  const thumb = control.locator(".rbx-switch-thumb");
  await expect(control).toHaveCSS("width", "40px");
  await expect(control).toHaveCSS("height", "24px");
  await expect(control).toHaveCSS("padding", "2px");
  await expect(control).toHaveCSS("background-color", "rgb(247, 247, 248)");
  await expect(thumb).toHaveCSS("background-color", "rgb(32, 34, 39)");
  await expect(thumb.locator(".rbx-icon")).toHaveCSS("opacity", "1");
  const offset = () =>
    thumb.evaluate(
      (el) =>
        el.getBoundingClientRect().left -
        el.parentElement!.getBoundingClientRect().left,
    );
  await expect.poll(offset).toBe(18);
  await control.click();
  await expect(control).not.toBeChecked();
  await expect(control).toHaveCSS(
    "background-color",
    "rgba(208, 217, 251, 0.12)",
  );
  await expect(thumb).toHaveCSS("background-color", "rgb(247, 247, 248)");
  await expect(thumb.locator(".rbx-icon")).toHaveCSS("opacity", "0");
  await expect.poll(offset).toBe(2);
  await page.evaluate(() => {
    document.documentElement.dir = "rtl";
  });
  await control.click();
  await expect(control).toBeChecked();
  await expect.poll(offset).toBe(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(control.locator(".rbx-switch-spacer").first()).toHaveCSS(
    "transition-duration",
    "0s",
  );
});
