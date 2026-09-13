import { test, expect } from "@playwright/test";

test("study joins the surface, excludes the current value, and preserves content behind it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/select-motion-reference");
  const trigger = page.getByRole("button", { name: "공개 범위 전체 공개" });
  const options = page.getByRole("group", { name: "다른 공개 범위" });
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(options.getByRole("button")).toHaveText(["친구만", "비공개"]);
  await expect(trigger).toHaveCSS("border-bottom-left-radius", "0px");
  const header = (await trigger.boundingBox())!;
  const clip = (await page.locator(".select-study-clip").boundingBox())!;
  expect(Math.abs(clip.y - header.y - header.height)).toBeLessThan(1);
  const underlying = page.getByRole("textbox", { name: "프로젝트 이름" });
  const originalTop = (await underlying.boundingBox())!.y;
  await page.screenshot({ path: "/tmp/select-motion-study-open.png" });
  await page.getByRole("button", { name: "모션 보기", exact: true }).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(options).toHaveCount(0);
  expect((await underlying.boundingBox())!.y).toBe(originalTop);
  await trigger.click();
  await options.getByRole("button", { name: "친구만" }).click();
  const updated = page.getByRole("button", { name: "공개 범위 친구만" });
  await expect(updated).toBeFocused();
  await expect(updated).toHaveAttribute("aria-expanded", "false");
  await updated.click();
  await expect(options.getByRole("button")).toHaveText(["전체 공개", "비공개"]);
  await page.keyboard.press("Tab");
  await expect(options.getByRole("button").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(updated).toBeFocused();
  await expect(updated).toHaveCSS("border-bottom-left-radius", "11px");
});

test("motion uses separate surface and list transitions, with a slower preview", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-reference?theme=dark");
  await page.getByRole("button", { name: "모션 보기", exact: true }).click();
  const trigger = page.getByRole("button", { name: "공개 범위 전체 공개" });
  await expect(page.locator(".select-study-reveal")).toHaveCSS(
    "grid-template-rows",
    "0px",
  );
  await page.getByRole("checkbox", { name: "4배 느리게 보기" }).check();
  await trigger.click();
  await expect(page.locator(".select-study-list")).toHaveCSS(
    "transition-delay",
    "0.4s",
  );
  await expect(page.locator(".select-study-reveal")).toHaveCSS(
    "transition-duration",
    "1.2s",
  );
  const frame = await page.locator(".select-study").evaluate((element) => {
    for (const animation of element.getAnimations({ subtree: true })) {
      animation.pause();
      animation.currentTime = 500;
    }
    const reveal = element.querySelector(".select-study-reveal")!;
    const list = element.querySelector(".select-study-list")!;
    return {
      height: reveal.getBoundingClientRect().height,
      fullHeight: list.getBoundingClientRect().height,
      opacity: Number(getComputedStyle(list).opacity),
      transform: getComputedStyle(list).transform,
    };
  });
  expect(frame.height).toBeGreaterThan(0);
  expect(frame.height).toBeLessThan(frame.fullHeight);
  expect(frame.opacity).toBeGreaterThan(0);
  expect(frame.opacity).toBeLessThan(1);
  expect(frame.transform).not.toBe("none");
});

for (const theme of ["light", "dark"]) {
  test(`${theme}: long list scroll hints follow edges and short list has no hints`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(`/preview/select-motion-reference?theme=${theme}`);
    await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
    const list = page.getByRole("group", {
      name: "다른 프로젝트",
      exact: true,
    });
    const trigger = page.getByRole("button", {
      name: "프로젝트 홈 화면",
      exact: true,
    });
    const up = page.getByRole("button", { name: "목록 위로 스크롤" });
    const down = page.getByRole("button", { name: "목록 아래로 스크롤" });
    await expect(list.getByRole("button")).toHaveCount(15);
    await expect(
      list.getByRole("button", { name: "홈 화면", exact: true }),
    ).toHaveCount(0);
    await expect(up).toHaveCount(0);
    await expect(down).toBeVisible();
    expect((await list.boundingBox())!.height).toBeLessThanOrEqual(240);
    const headerTop = (await trigger.boundingBox())!.y;
    await down.click();
    await expect(up).toBeVisible();
    await expect(down).toBeVisible();
    await expect(up).toHaveCSS("background-image", /linear-gradient/);
    await expect(down).toHaveCSS("background-image", /linear-gradient/);
    await page.screenshot({ path: `/tmp/select-study-long-${theme}.png` });
    await list.hover();
    await page.mouse.wheel(0, 4000);
    await expect(down).toHaveCount(0);
    await expect(up).toBeVisible();
    expect((await trigger.boundingBox())!.y).toBe(headerTop);
    await list.getByRole("button", { name: "보관함", exact: true }).click();
    const updated = page.getByRole("button", {
      name: "프로젝트 보관함",
      exact: true,
    });
    await expect(updated).toBeFocused();
    await updated.click();
    await expect(
      list.getByRole("button", { name: "보관함", exact: true }),
    ).toHaveCount(0);
    await expect(up).toHaveCount(0);
    await expect(down).toBeVisible();
    await list.getByRole("button").last().focus();
    await expect(down).toHaveCount(0);
    const lastBox = (await list.getByRole("button").last().boundingBox())!;
    const listBox = (await list.boundingBox())!;
    expect(lastBox.y + lastBox.height).toBeLessThanOrEqual(
      listBox.y + listBox.height,
    );
    await page.getByRole("button", { name: "적은 목록 · 3개" }).click();
    await expect(up).toHaveCount(0);
    await expect(down).toHaveCount(0);
    await expect(
      page.getByRole("group", { name: "다른 공개 범위" }).getByRole("button"),
    ).toHaveCount(2);
  });
}

for (const theme of ["light", "dark"]) {
  test(`${theme}: both edges shrink near their ends without changing scroll geometry`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/preview/select-motion-reference?theme=${theme}`);
    await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
    const scroll = page.locator(".select-study-scroll");
    const up = page.locator('.select-study-edge[data-side="up"]');
    const down = page.locator('.select-study-edge[data-side="down"]');
    const max = await scroll.evaluate(
      (node) => node.scrollHeight - node.clientHeight,
    );
    const first = scroll.getByRole("button").first();
    const firstTop = (await first.boundingBox())!.y;
    const cases = [
      [0, 0, 1],
      [24, 0.5, 1],
      [48, 1, 1],
      [max - 48, 1, 1],
      [max - 24, 1, 0.5],
      [max, 1, 0],
      [max - 24, 1, 0.5],
      [24, 0.5, 1],
      [0, 0, 1],
    ];
    for (const [position, topStrength, bottomStrength] of cases) {
      await scroll.evaluate((node, y) => {
        node.scrollTop = y;
      }, position);
      await expect(up).toHaveCSS("opacity", String(topStrength));
      await expect(down).toHaveCSS("opacity", String(bottomStrength));
      await expect(up).toHaveCSS("height", `${28 * topStrength}px`);
      await expect(down).toHaveCSS("height", `${28 * bottomStrength}px`);
      expect(
        await scroll.evaluate((node) => node.scrollHeight - node.clientHeight),
      ).toBe(max);
      expect(
        Math.abs((await first.boundingBox())!.y - (firstTop - position)),
      ).toBeLessThan(1);
    }
    const scrollTop = (await scroll.boundingBox())!.y;
    expect(firstTop - scrollTop).toBe(8);
    await expect(up).toBeDisabled();
    // 끝에 멈춘 뒤에도 스크롤 범위와 표시가 다시 흔들리지 않습니다.
    const settled = await scroll.evaluate(async (node) => {
      const values = [];
      for (let i = 0; i < 12; i++) {
        await new Promise(requestAnimationFrame);
        values.push(node.scrollTop);
      }
      return values;
    });
    expect(settled.every((position) => position === 0)).toBe(true);
    await expect(up).toHaveCSS("height", "0px");
  });
}

test("edge space and opacity animate together when a scroll reaches the end", async ({
  page,
}) => {
  await page.goto("/preview/select-motion-reference");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
  const scroll = page.locator(".select-study-scroll");
  const up = page.locator('.select-study-edge[data-side="up"]');
  await scroll.evaluate((node) => {
    node.scrollTop = 80;
  });
  await expect(up).toHaveCSS("height", "28px");
  await scroll.evaluate((node) => {
    node.scrollTop = 0;
  });
  await expect(up).toBeDisabled();
  const halfway = await up.evaluate((node) => {
    for (const animation of node.getAnimations()) {
      animation.pause();
      animation.currentTime = 50;
    }
    const style = getComputedStyle(node);
    return { height: parseFloat(style.height), opacity: Number(style.opacity) };
  });
  expect(halfway.height).toBeGreaterThan(0);
  expect(halfway.height).toBeLessThan(28);
  expect(halfway.opacity).toBeGreaterThan(0);
  expect(halfway.opacity).toBeLessThan(1);
  await up.evaluate((node) =>
    node.getAnimations().forEach((animation) => animation.finish()),
  );
  await expect(up).toHaveCSS("height", "0px");
  await expect(up).toHaveCSS("opacity", "0");
});

test("placement flips upward with a fixed trigger and caps the list to available space", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/select-motion-reference");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
  const surface = page.locator(".select-study-surface");
  const trigger = page.getByRole("button", { name: "프로젝트 홈 화면" });
  const scroll = page.locator(".select-study-scroll");
  await expect(surface).toHaveAttribute("data-side", "down");
  await page.getByRole("button", { name: "아래쪽에 놓기" }).click();
  await expect(surface).toHaveAttribute("data-side", "up");
  const before = (await trigger.boundingBox())!;
  const listBox = (await scroll.boundingBox())!;
  expect(Math.abs(listBox.y + listBox.height + 1 - before.y)).toBeLessThan(1);
  expect((await surface.boundingBox())!.y).toBeGreaterThanOrEqual(8);
  await expect(trigger).toHaveCSS("border-top-left-radius", "0px");
  await trigger.click();
  const closed = (await trigger.boundingBox())!;
  expect(closed.y).toBe(before.y);
  await trigger.click();
  expect((await trigger.boundingBox())!.y).toBe(before.y);
  await page.screenshot({ path: "/tmp/select-study-up.png" });
  // 좁은 호스트 영역에서도 경계 밖으로 넘기지 않습니다.
  await page.getByRole("button", { name: "기본 위치" }).click();
  await page.locator(".select-study-stage").evaluate((el) => {
    (el as HTMLElement).style.height = "200px";
  });
  await expect
    .poll(async () => (await scroll.boundingBox())!.height)
    .toBeLessThan(160);
  const boundary = (await page.locator(".select-study-stage").boundingBox())!;
  const popup = (await surface.boundingBox())!;
  expect(popup.y + popup.height).toBeLessThanOrEqual(
    boundary.y + boundary.height - 7,
  );
});

test("multiple selection keeps choices in place and keyboard navigation reveals focused rows", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/select-motion-reference?theme=dark");
  await page.getByRole("button", { name: "다중 선택", exact: true }).click();
  const group = page.getByRole("group", { name: "선택할 분야", exact: true });
  const design = group.getByRole("button", { name: "디자인", exact: true });
  await expect(design).toHaveAttribute("aria-pressed", "true");
  await group.getByRole("button", { name: "개발", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "분야 디자인, 개발" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(group.getByRole("button")).toHaveCount(3);
  await expect(group.locator('[data-icon="icon-filled-check"]')).toHaveCount(2);
  await design.click();
  await expect(design).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("status")).toHaveText("선택한 항목: 개발");
  await page.screenshot({ path: "/tmp/select-study-multiple.png" });
  await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
  const trigger = page.locator(".select-study-trigger");
  await trigger.click();
  await trigger.press("ArrowDown");
  const list = page.getByRole("group", {
    name: "선택할 프로젝트",
    exact: true,
  });
  await expect(list.getByRole("button").first()).toBeFocused();
  await page.keyboard.press("End");
  const last = list.getByRole("button").last();
  await expect(last).toBeFocused();
  await page.keyboard.press("Space");
  await expect(last).toHaveAttribute("aria-pressed", "true");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Home");
  await expect(list.getByRole("button").first()).toBeFocused();
  for (let i = 0; i < 7; i++) await page.keyboard.press("ArrowDown");
  const current = (await list.getByRole("button").nth(7).boundingBox())!;
  const box = (await list.boundingBox())!;
  expect(current.y).toBeGreaterThanOrEqual(box.y + 28);
  expect(current.y + current.height).toBeLessThanOrEqual(
    box.y + box.height - 28,
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("touch swipe scrolls the list without changing selection", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5174/preview/select-motion-reference");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).tap();
  const scroll = page.locator(".select-study-scroll");
  const box = (await scroll.boundingBox())!;
  const client = await context.newCDPSession(page);
  const x = box.x + box.width / 2;
  const y = box.y + box.height - 36;
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
    .poll(() => scroll.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(20);
  await expect(
    page.getByRole("button", { name: "프로젝트 홈 화면", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await context.close();
});

test("wrapped selected labels keep upward placement joined and slow controls preserve an open popup", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/select-motion-reference");
  await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
  await page.getByRole("button", { name: "아래쪽에 놓기" }).click();
  await page.locator(".select-study-stage").evaluate((el) => {
    (el as HTMLElement).style.width = "240px";
  });
  await page
    .getByRole("button", {
      name: "팀 구성원만 열람할 수 있는 프로젝트",
      exact: true,
    })
    .click();
  const trigger = page.locator(".select-study-trigger");
  await expect
    .poll(async () => (await trigger.boundingBox())!.height)
    .toBeGreaterThan(46);
  await trigger.click();
  const surface = page.locator(".select-study-surface");
  await expect(surface).toHaveAttribute("data-side", "up");
  const header = (await trigger.boundingBox())!;
  const anchor = (await page.locator(".select-study-anchor").boundingBox())!;
  expect(Math.abs(header.y - anchor.y - 1)).toBeLessThan(1);
  const clip = (await page.locator(".select-study-clip").boundingBox())!;
  expect(Math.abs(clip.y + clip.height - header.y)).toBeLessThan(1);
  await page.getByRole("button", { name: "모션 보기", exact: true }).click();
  await trigger.click();
  await page.getByRole("checkbox", { name: "4배 느리게 보기" }).check();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

for (const theme of ["light", "dark"]) {
  test(`${theme}: multiple summary shows two names, then a noninteractive count badge, without growing`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/preview/select-motion-reference?theme=${theme}`);
    await page.getByRole("button", { name: "다중 선택", exact: true }).click();
    const trigger = page.locator(".select-study-trigger");
    const badge = trigger.locator(".rbx-badge");
    const group = page.getByRole("group", { name: "선택할 분야", exact: true });
    await group.getByRole("button", { name: "개발", exact: true }).click();
    await expect(trigger).toHaveAccessibleName("분야 디자인, 개발");
    await expect(badge).toHaveCount(0);
    await group.getByRole("button", { name: "운영", exact: true }).click();
    await expect(badge).toHaveText("외 1개");
    await expect(trigger).toHaveAccessibleName("분야 디자인, 개발 외 1개");
    await expect(badge).not.toHaveAttribute("tabindex");
    await badge.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await group.getByRole("button", { name: "디자인", exact: true }).click();
    await expect(badge).toHaveCount(0);
    await expect(trigger).toHaveAccessibleName("분야 개발, 운영");
    await group.getByRole("button", { name: "개발", exact: true }).click();
    await group.getByRole("button", { name: "운영", exact: true }).click();
    await expect(trigger).toHaveAccessibleName("분야 선택하세요");
    await page.getByRole("button", { name: "많은 목록 · 16개" }).click();
    const projects = page.getByRole("group", {
      name: "선택할 프로젝트",
      exact: true,
    });
    const longName = "팀 구성원만 열람할 수 있는 프로젝트";
    await projects.getByRole("button", { name: longName, exact: true }).click();
    await projects
      .getByRole("button", { name: "프로젝트 관리", exact: true })
      .click();
    for (const width of [336, 240]) {
      await page.locator(".select-study-stage").evaluate((el, value) => {
        (el as HTMLElement).style.width = `${value}px`;
      }, width);
      await expect(trigger).toHaveCSS("height", "46px");
      await expect(badge).toHaveText("외 1개");
      const names = trigger.locator(".select-study-name");
      await expect(names).toHaveText(["홈 화면", longName]);
      await expect(names.last()).toHaveCSS("text-overflow", "ellipsis");
      expect(
        await names.last().evaluate((el) => el.scrollWidth > el.clientWidth),
      ).toBe(true);
      await expect(names.last()).toHaveAttribute("title", longName);
      const badgeBox = (await badge.boundingBox())!;
      const iconBox = (await trigger
        .locator(".select-study-chevron")
        .boundingBox())!;
      const nameBox = (await names.last().boundingBox())!;
      expect(nameBox.x + nameBox.width).toBeLessThan(badgeBox.x);
      expect(badgeBox.x + badgeBox.width).toBeLessThan(iconBox.x);
    }
    await page.screenshot({ path: `/tmp/select-study-summary-${theme}.png` });
  });
}
