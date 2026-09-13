import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Base UI의 포커스 경계용 노드는 의도적으로 aria-hidden+tabIndex를 사용합니다.
// 해당 노드만 axe 검사에서 제외하고, 실제 Tab/Escape 동작은 별도로 검증합니다.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("single selection submits stable values and supports errors, external changes and reset", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-study");
  const trigger = page.getByRole("combobox");
  await expect(page.getByRole("option")).toHaveText(["친구만", "비공개"]);
  await page.getByRole("option", { name: "친구만", exact: true }).click();
  await expect(trigger).toContainText("친구만");
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "폼 제출", exact: true }).click();
  await expect(page.getByRole("status", { name: "폼 제출 결과" })).toHaveText(
    '["friends"]',
  );
  await page.getByRole("button", { name: "선택 비우기" }).click();
  await page.getByRole("button", { name: "폼 제출", exact: true }).click();
  await expect(trigger).toHaveAttribute("aria-invalid", "true");
  await expect(trigger).toBeFocused();
  await expect(page.locator(".rbx-attached-error")).toContainText("선택하세요");
  await page.getByRole("button", { name: "외부에서 두 번째 값 지정" }).click();
  await expect(trigger).toContainText("친구만");
  await expect(page.locator(".rbx-attached-error")).toHaveCount(0);
  await page.getByRole("button", { name: "초기화", exact: true }).click();
  await expect(trigger).toContainText("전체 공개");
  await trigger.click();
  await expect(page.getByRole("option")).toHaveText(["친구만", "비공개"]);
  await trigger.click();
  await expect(page.getByRole("listbox")).toHaveCount(0);
});

test("keyboard skips hidden values, announces disabled items, and returns focus", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
  await page.getByRole("button", { name: "모션 보기", exact: true }).click();
  const trigger = page.getByRole("combobox");
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("option", { name: "프로젝트 관리", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("option", { name: "보관함", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toContainText("홈 화면");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("option", { name: "프로젝트 관리", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toContainText("프로젝트 관리");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("listbox")).toHaveCount(0);
});

test("multi select announces checked options, summarizes two names and submits each value", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "다중 선택", exact: true }).click();
  const trigger = page.getByRole("combobox");
  await expect(page.getByRole("listbox")).toHaveAttribute(
    "aria-multiselectable",
    "true",
  );
  await page.getByRole("option", { name: "개발", exact: true }).click();
  await page.getByRole("option", { name: "운영", exact: true }).click();
  await expect(trigger.locator(".rbx-attached-name")).toHaveText([
    "디자인",
    "개발",
  ]);
  await expect(trigger.locator(".rbx-attached-count")).toHaveText("외 1개");
  await expect(
    page.getByRole("option", { name: "개발", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await trigger.locator(".rbx-attached-count").click();
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await page.getByRole("button", { name: "폼 제출", exact: true }).click();
  await expect(page.getByRole("status", { name: "폼 제출 결과" })).toHaveText(
    '["design","development","operations"]',
  );
});

test("uncontrolled fields reset and disabled options cannot be selected", async ({
  page,
}) => {
  await page.goto("/preview/select-form");
  const trigger = page.getByRole("combobox", { name: /담당 분야/ });
  await trigger.click();
  await expect(
    page.getByRole("option", { name: "운영", exact: true }),
  ).toHaveAttribute("aria-disabled", "true");
  await page.getByRole("option", { name: "개발", exact: true }).click();
  await page.getByRole("button", { name: "제출", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(
    '[["team","b"],["collaborators","a"],["collaborators","b"]]',
  );
  await page.getByRole("button", { name: "초기값 복원" }).click();
  await expect(trigger).toContainText("디자인");
  await page.getByRole("button", { name: "제출", exact: true }).click();
  await expect(page.getByRole("status")).toContainText('["team","a"]');
});

test("dialog selection preserves dialog focus and accessible semantics", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-study");
  await page
    .getByRole("button", { name: "다이얼로그 안", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const trigger = page.getByRole("combobox");
  await trigger.click();
  const results = await new AxeBuilder({ page })
    .include(".rbx-attached-field")
    .include(".rbx-attached-positioner")
    .exclude("[data-base-ui-focus-guard]")
    .analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole("option", { name: "친구만", exact: true }).click();
  await expect(trigger).toContainText("친구만");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("readonly preserves values and disabled fields are omitted from submission", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-study");
  await page.getByRole("checkbox", { name: "읽기 전용" }).check();
  const trigger = page.getByRole("combobox");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-readonly", "true");
  await page.getByRole("option", { name: "친구만", exact: true }).click();
  await expect(trigger).toContainText("전체 공개");
  await page.getByRole("checkbox", { name: "비활성", exact: true }).check();
  await expect(trigger).toBeDisabled();
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await page.getByRole("button", { name: "폼 제출", exact: true }).click();
  await expect(page.getByRole("status", { name: "폼 제출 결과" })).toHaveText(
    "[]",
  );
});

for (const theme of ["light", "dark"]) {
  test(`${theme}: sizes, upward placement and continuous scroll hints preserve geometry`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 850 });
    await page.goto(`/preview/select-motion-study?theme=${theme}`);
    await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
    for (const [size, height] of [
      ["SM", 32],
      ["MD", 40],
      ["LG", 48],
    ] as const) {
      await page.getByRole("button", { name: size, exact: true }).click();
      const trigger = page.getByRole("combobox");
      await expect(trigger).toHaveCSS("height", `${height}px`);
      const header = (await trigger.boundingBox())!;
      const popup = (await page.locator(".rbx-attached-popup").boundingBox())!;
      expect(Math.abs(header.width - popup.width)).toBeLessThan(1);
      expect(Math.abs(header.y - popup.y)).toBeLessThan(2);
    }
    const list = page.getByRole("listbox");
    const up = page.locator('.rbx-attached-edge[data-edge="up"]');
    const down = page.locator('.rbx-attached-edge[data-edge="down"]');
    await expect(up).toHaveCSS("height", "0px");
    await expect(down).toHaveCSS("height", "28px");
    const max = await list.evaluate((el) => el.scrollHeight - el.clientHeight);
    await list.evaluate((el) => {
      el.scrollTop = 24;
    });
    await expect(up).toHaveCSS("opacity", "0.5");
    await expect(up).toHaveCSS("height", "14px");
    await list.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await expect(down).toHaveCSS("height", "0px");
    expect(await list.evaluate((el) => el.scrollHeight - el.clientHeight)).toBe(
      max,
    );
    await page.getByRole("button", { name: "아래쪽에 놓기" }).click();
    await expect(page.locator(".rbx-attached-popup")).toHaveAttribute(
      "data-side",
      "top",
    );
    const header = (await page.getByRole("combobox").boundingBox())!;
    const popup = (await page.locator(".rbx-attached-popup").boundingBox())!;
    expect(
      Math.abs(header.y + header.height - popup.y - popup.height),
    ).toBeLessThan(2);
    expect(popup.y).toBeGreaterThanOrEqual(8);
    await page.screenshot({
      path: `/tmp/select-attached-${theme}.png`,
      fullPage: true,
    });
    const results = await new AxeBuilder({ page })
      .include(".rbx-attached-field")
      .include(".rbx-attached-positioner")
      .exclude("[data-base-ui-focus-guard]")
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("scroll host moves the attached surface with the trigger", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "스크롤 영역", exact: true }).click();
  await page.getByRole("combobox").click();
  const host = page.getByRole("region", { name: "스크롤 테스트 영역" });
  await host.evaluate((el) => {
    el.scrollTop = 35;
  });
  await expect
    .poll(async () => {
      const header = (await page.getByRole("combobox").boundingBox())!;
      const popup = (await page.locator(".rbx-attached-popup").boundingBox())!;
      return Math.abs(header.y - popup.y);
    })
    .toBeLessThan(2);
  await host.evaluate((el) => {
    el.scrollTop = 300;
  });
  await expect(page.locator(".rbx-attached-positioner")).toHaveAttribute(
    "data-anchor-hidden",
    "",
  );
});

test("touch scrolling does not select an item and touch targets stay usable at SM", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5174/preview/select-motion-study");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).tap();
  await page.getByRole("button", { name: "SM", exact: true }).tap();
  const list = page.getByRole("listbox");
  const box = (await list.boundingBox())!;
  expect(
    (await page.getByRole("option").first().boundingBox())!.height,
  ).toBeGreaterThanOrEqual(44);
  const client = await context.newCDPSession(page);
  const x = box.x + box.width / 2,
    y = box.y + box.height - 36;
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let i = 1; i <= 8; i++)
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y - i * 16 }],
    });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => list.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(20);
  await expect(page.getByRole("combobox")).toContainText("홈 화면");
  await expect(list).toBeVisible();
  await context.close();
});

test("entry and exit animate the surface height and inner list separately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "모션 보기", exact: true }).click();
  await expect(page.locator(".rbx-attached-popup")).toBeHidden();
  await page.getByRole("checkbox", { name: "4배 느리게 보기" }).check();
  await page.getByRole("combobox").click();
  const popup = page.locator(".rbx-attached-popup");
  await expect(popup).toHaveAttribute("data-open", "");
  await expect(popup).toBeVisible();
  await expect(popup).not.toHaveAttribute("data-starting-style", "");
  const entering = await popup.evaluate((el) => {
    const animations = el.getAnimations({ subtree: true });
    for (const animation of animations) {
      animation.pause();
      animation.currentTime = 500;
    }
    const clip = el.querySelector(".rbx-attached-clip")!;
    const list = el.querySelector(".rbx-attached-list-shell")!;
    return {
      count: animations.length,
      clipped: clip.getBoundingClientRect().height,
      full: list.getBoundingClientRect().height,
      opacity: Number(getComputedStyle(list).opacity),
    };
  });
  expect(entering.count).toBeGreaterThan(1);
  expect(entering.clipped).toBeGreaterThan(0);
  expect(entering.clipped).toBeLessThan(entering.full);
  expect(entering.opacity).toBeGreaterThan(0);
  expect(entering.opacity).toBeLessThan(1);
  await popup.evaluate((el) => {
    for (const animation of el.getAnimations({ subtree: true }))
      animation.finish();
  });
  await page.getByRole("option", { name: "친구만", exact: true }).click();
  await expect(popup).toHaveAttribute("data-ending-style", "");
  const exiting = await popup.evaluate((el) => {
    for (const animation of el.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = 400;
    }
    return {
      clipped: el.querySelector(".rbx-attached-clip")!.getBoundingClientRect()
        .height,
      opacity: Number(
        getComputedStyle(el.querySelector(".rbx-attached-list-shell")!).opacity,
      ),
    };
  });
  expect(exiting.clipped).toBeGreaterThan(0);
  expect(exiting.clipped).toBeLessThan(entering.full);
  expect(exiting.opacity).toBeGreaterThan(0);
  expect(exiting.opacity).toBeLessThan(1);
  await popup.evaluate((el) => {
    for (const animation of el.getAnimations({ subtree: true }))
      animation.finish();
  });
  await expect(popup).toBeHidden();
});

test("short viewports cap the list and long single labels keep the surface attached", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
  await page
    .getByRole("option", {
      name: "팀 구성원만 열람할 수 있는 프로젝트",
      exact: true,
    })
    .click();
  await page.setViewportSize({ width: 320, height: 420 });
  const trigger = page.getByRole("combobox");
  await trigger.click();
  const popup = page.locator(".rbx-attached-popup");
  await expect(popup).toBeVisible();
  const rect = (await popup.boundingBox())!;
  expect(rect.x).toBeGreaterThanOrEqual(8);
  expect(rect.x + rect.width).toBeLessThanOrEqual(312);
  expect(rect.y).toBeGreaterThanOrEqual(8);
  expect(rect.y + rect.height).toBeLessThanOrEqual(413);
  const header = (await trigger.boundingBox())!;
  const decorative = (await page
    .locator(".rbx-attached-header")
    .boundingBox())!;
  expect(Math.abs(header.y - decorative.y)).toBeLessThan(2);
  expect(header.height).toBeGreaterThan(48);
  await expect(
    page.locator(".rbx-attached-header .rbx-attached-name"),
  ).toHaveText("팀 구성원만 열람할 수 있는 프로젝트");
});

test("Tab leaves the popup without stealing focus; native required validation blocks empty values", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "모션 보기", exact: true }).click();
  const trigger = page.getByRole("combobox");
  await trigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("option", { name: "친구만", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "폼 제출", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await page.getByRole("button", { name: "선택 비우기" }).click();
  await page.locator("form.study-form").evaluate((el) => {
    (el as HTMLFormElement).noValidate = false;
  });
  await page.getByRole("button", { name: "폼 제출", exact: true }).click();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("status", { name: "폼 제출 결과" })).toHaveCount(
    0,
  );
  expect(
    await page
      .locator('input[name="choice"]')
      .evaluate((el: HTMLInputElement) => el.validity.valueMissing),
  ).toBe(true);
});

test("long multi summaries keep two names and a badge within every size", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
  await page.getByRole("button", { name: "다중 선택", exact: true }).click();
  await page.getByRole("option", { name: "홈 화면", exact: true }).click();
  await page
    .getByRole("option", {
      name: "팀 구성원만 열람할 수 있는 프로젝트",
      exact: true,
    })
    .click();
  await page
    .getByRole("option", { name: "프로젝트 관리", exact: true })
    .click();
  await page
    .getByRole("option", { name: "에셋 라이브러리", exact: true })
    .click();
  const trigger = page.getByRole("combobox");
  for (const [size, height] of [
    ["SM", 32],
    ["MD", 40],
    ["LG", 48],
  ] as const) {
    await page.getByRole("button", { name: size, exact: true }).click();
    await expect(trigger.locator(".rbx-attached-name")).toHaveText([
      "팀 구성원만 열람할 수 있는 프로젝트",
      "프로젝트 관리",
    ]);
    await expect(trigger.locator(".rbx-attached-count")).toHaveText("외 1개");
    await expect(trigger).toHaveCSS("height", `${height}px`);
    expect(
      await trigger
        .locator(".rbx-attached-name")
        .first()
        .evaluate((el) => el.scrollWidth > el.clientWidth),
    ).toBe(true);
    const header = (await trigger.boundingBox())!,
      badge = (await trigger.locator(".rbx-attached-count").boundingBox())!;
    expect(badge.x + badge.width).toBeLessThan(header.x + header.width - 20);
  }
});

test("upward motion keeps its direction and the selected header at the trigger", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
  await page.getByRole("button", { name: "아래쪽에 놓기" }).click();
  await page.getByRole("button", { name: "모션 보기", exact: true }).click();
  await expect(page.locator(".rbx-attached-popup")).toBeHidden();
  await page.getByRole("combobox").click();
  const frames = await page.evaluate(async () => {
    const samples: { side: string | null; delta: number }[] = [];
    for (let i = 0; i < 30; i++) {
      await new Promise(requestAnimationFrame);
      const popup = document.querySelector(".rbx-attached-popup");
      const header = document.querySelector(".rbx-attached-header");
      const trigger = document.querySelector(".rbx-attached-trigger");
      if (
        popup &&
        header &&
        trigger &&
        Number(getComputedStyle(popup.parentElement!).opacity) > 0 &&
        getComputedStyle(header).visibility === "visible" &&
        header.getBoundingClientRect().height
      )
        samples.push({
          side: popup.getAttribute("data-side"),
          delta: Math.abs(
            header.getBoundingClientRect().y -
              trigger.getBoundingClientRect().y,
          ),
        });
    }
    return samples;
  });
  expect(frames.length).toBeGreaterThan(10);
  expect([...new Set(frames.map((frame) => frame.side))]).toEqual(["top"]);
  expect(Math.max(...frames.map((frame) => frame.delta))).toBeLessThan(2);
});

test("multi-select keeps its header and divider fixed through repeated open/close", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/select-motion-study");
  await page.getByRole("button", { name: "다중 선택", exact: true }).click();
  await page.getByRole("option", { name: "개발", exact: true }).click();
  await page.getByRole("option", { name: "운영", exact: true }).click();
  await page.getByRole("button", { name: "모션 보기", exact: true }).click();
  const trigger = page.getByRole("combobox");
  const popup = page.locator(".rbx-attached-popup");
  await expect(popup).toBeHidden();
  for (const size of ["SM", "MD", "LG"]) {
    await page.getByRole("button", { name: size, exact: true }).click();
    await expect(popup).toBeVisible();
    await trigger.click();
    await expect(popup).toBeHidden();
    const original = (await trigger.boundingBox())!;
    for (let cycle = 0; cycle < 2; cycle++) {
      await trigger.click();
      await expect(popup).toHaveAttribute("data-open", "");
      const frames = await page.evaluate(async () => {
        const samples: {
          height: number;
          headerHeight: number;
          headerY: number;
          triggerY: number;
          dividerY: number;
          dividerOpacity: string;
          nameDelta: number;
        }[] = [];
        for (let i = 0; i < 27; i++) {
          await new Promise(requestAnimationFrame);
          const popup = document.querySelector<HTMLElement>(
            ".rbx-attached-popup",
          )!;
          if (Number(getComputedStyle(popup.parentElement!).opacity) === 0)
            continue;
          const trigger = document.querySelector<HTMLElement>(
            ".rbx-attached-trigger",
          )!;
          const header = popup.querySelector<HTMLElement>(
            ".rbx-attached-header",
          )!;
          const reveal = popup.querySelector<HTMLElement>(
            ".rbx-attached-reveal",
          )!;
          const divider = getComputedStyle(reveal, "::before");
          const a = trigger
            .querySelector(".rbx-attached-name")!
            .getBoundingClientRect();
          const b = header
            .querySelector(".rbx-attached-name")!
            .getBoundingClientRect();
          samples.push({
            height: popup.getBoundingClientRect().height,
            headerHeight: header.getBoundingClientRect().height,
            headerY: header.getBoundingClientRect().y,
            triggerY: trigger.getBoundingClientRect().y,
            dividerY: reveal.getBoundingClientRect().y,
            dividerOpacity: divider.opacity,
            nameDelta: Math.max(
              Math.abs(a.x - b.x),
              Math.abs(a.width - b.width),
              Math.abs(a.y - b.y),
            ),
          });
        }
        return samples;
      });
      expect(frames.length).toBeGreaterThan(10);
      for (const [index, frame] of frames.entries()) {
        expect(Math.abs(frame.headerHeight + 2 - original.height)).toBeLessThan(
          1,
        );
        expect(Math.abs(frame.headerY - frame.triggerY - 1)).toBeLessThan(1);
        expect(
          Math.abs(frame.dividerY - frame.triggerY - original.height + 1),
        ).toBeLessThan(1);
        expect(frame.dividerOpacity).toBe("1");
        expect(frame.nameDelta).toBeLessThan(1);
        if (index)
          expect(frame.height).toBeGreaterThanOrEqual(
            frames[index - 1].height - 0.5,
          );
      }
      await trigger.click();
      await expect(popup).toHaveAttribute("data-ending-style", "");
      const closing = await page.evaluate(async () => {
        const heights: number[] = [];
        const headerDifferences: number[] = [];
        for (let i = 0; i < 18; i++) {
          await new Promise(requestAnimationFrame);
          const popup = document.querySelector<HTMLElement>(
            ".rbx-attached-popup",
          );
          if (!popup?.getBoundingClientRect().height) continue;
          const header = popup
            .querySelector(".rbx-attached-header")!
            .getBoundingClientRect();
          const trigger = document
            .querySelector(".rbx-attached-trigger")!
            .getBoundingClientRect();
          heights.push(popup.getBoundingClientRect().height);
          headerDifferences.push(
            Math.abs(header.y - trigger.y - 1),
            Math.abs(header.height + 2 - trigger.height),
            Math.abs(popup.getBoundingClientRect().width - trigger.width),
            Math.abs(popup.getBoundingClientRect().x - trigger.x),
          );
          for (const selector of [
            ".rbx-attached-name",
            ".rbx-attached-count",
          ]) {
            const visible = popup
              .querySelector(selector)!
              .getBoundingClientRect();
            const closed = document
              .querySelector(`.rbx-attached-trigger ${selector}`)!
              .getBoundingClientRect();
            headerDifferences.push(
              Math.abs(visible.x - closed.x),
              Math.abs(visible.width - closed.width),
            );
          }
        }
        return { heights, headerDifferences };
      });
      expect(closing.heights.length).toBeGreaterThan(2);
      expect(Math.max(...closing.headerDifferences)).toBeLessThan(1);
      for (let i = 1; i < closing.heights.length; i++)
        expect(closing.heights[i]).toBeLessThanOrEqual(
          closing.heights[i - 1] + 0.5,
        );
      await expect(popup).toBeHidden();
      expect((await trigger.boundingBox())!.height).toBe(original.height);
      expect((await trigger.boundingBox())!.width).toBe(original.width);
    }
  }
});
