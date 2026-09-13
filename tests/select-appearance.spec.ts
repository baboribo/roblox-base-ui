import { test, expect, type Locator } from "@playwright/test";

test("the public Select keeps its current value in the header and offers only other values", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/select");
  const trigger = page.getByRole("combobox");
  for (const [current, next] of [
    ["전체 공개", "비공개"],
    ["비공개", "친구만"],
  ]) {
    await trigger.click();
    const popup = page.locator(".rbx-attached-popup");
    await expect(popup).toBeVisible();
    await expect(
      page.getByRole("option", { name: current, exact: true }),
    ).toHaveCount(0);
    await expect(popup.locator(".rbx-attached-header")).toContainText(current);
    const a = (await trigger.boundingBox())!,
      b = (await popup.locator(".rbx-attached-header").boundingBox())!;
    expect(Math.abs(a.y - b.y)).toBeLessThan(2);
    await page.getByRole("option", { name: next, exact: true }).click();
    await expect(trigger).toContainText(next);
    await expect(trigger).toBeFocused();
  }
});

test("popup follows trigger resizing and long labels wrap within its width", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/select");
  const trigger = page.getByRole("combobox");
  await trigger.evaluate((el) => {
    el.parentElement!.style.maxWidth = "600px";
  });
  await trigger.click();
  const popup = page.locator(".rbx-attached-popup");
  async function expectMatchingWidth() {
    await expect(popup).toBeVisible();
    await expect
      .poll(async () => {
        const popupBox = await popup.boundingBox();
        const triggerBox = await trigger.boundingBox();
        return popupBox && triggerBox
          ? Math.abs(popupBox.width - triggerBox.width)
          : Infinity;
      })
      .toBeLessThan(1);
  }
  await expectMatchingWidth();
  await page.setViewportSize({ width: 500, height: 1000 });
  if ((await trigger.getAttribute("aria-expanded")) === "false")
    await trigger.click();
  await expectMatchingWidth();
  await trigger.evaluate((el) => {
    el.parentElement!.style.maxWidth = "180px";
  });
  await expectMatchingWidth();
  const label = page
    .getByRole("option")
    .last()
    .locator(".rbx-attached-option-text");
  await label.evaluate((el) => {
    el.textContent = "팀 구성원만 열람할 수 있는 프로젝트";
  });
  const dimensions = await label.evaluate((el) => ({
    height: el.getBoundingClientRect().height,
    lineHeight: parseFloat(getComputedStyle(el).lineHeight),
    width: el.clientWidth,
    scrollWidth: el.scrollWidth,
  }));
  expect(dimensions.height).toBeGreaterThan(dimensions.lineHeight * 1.5);
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width);
  await expectMatchingWidth();
});

// 반투명 토큰은 부모 배경 위에 합성한 실제 색으로 대비를 계산합니다.
async function textContrast(option: Locator) {
  return option.evaluate((element) => {
    const context = document.createElement("canvas").getContext("2d")!;
    function rgba(css: string) {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = css;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data);
    }
    function composite(front: number[], back: number[]) {
      const alpha = front[3] / 255;
      return front
        .slice(0, 3)
        .map((value, i) => value * alpha + back[i] * (1 - alpha));
    }
    function luminance(rgb: number[]) {
      const linear = rgb.map((value) => {
        const channel = value / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    }
    const ancestors: Element[] = [];
    for (let node: Element | null = element; node; node = node.parentElement)
      ancestors.unshift(node);
    let background = [255, 255, 255];
    for (const node of ancestors)
      background = composite(
        rgba(getComputedStyle(node).backgroundColor),
        background,
      );
    const foreground = composite(
      rgba(getComputedStyle(element).color),
      background,
    );
    const light = luminance(foreground);
    const dark = luminance(background);
    return (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
  });
}

for (const theme of ["light", "dark"]) {
  for (const example of ["select-sm", "select-multiple"]) {
    test(`${theme} ${example}: selected text stays readable and keyboard highlight stays visible`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/preview/${example}?theme=${theme}`);
      await page.getByRole("combobox").click();
      const selected = page.getByRole("option").first();
      await expect(selected).toHaveAttribute(
        "aria-selected",
        example === "select-multiple" ? "true" : "false",
      );
      await expect(selected).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
      await page.getByRole("option").last().hover();
      await expect(page.getByRole("option").last()).toHaveCSS(
        "outline-style",
        "none",
      );
      await page.keyboard.press("Home");
      await expect(selected).toHaveAttribute("data-highlighted", "");
      await expect(selected).toHaveCSS("outline-style", "solid");
      await expect(selected).toHaveCSS("outline-width", "2px");
      expect(await textContrast(selected)).toBeGreaterThanOrEqual(4.5);
      const selectedBackground = await selected.evaluate(
        (el) => getComputedStyle(el).backgroundColor,
      );
      await page.keyboard.press("End");
      await expect(selected).not.toHaveAttribute("data-highlighted");
      await expect(selected).toHaveCSS("outline-style", "none");
      await expect(selected).toHaveCSS("background-color", selectedBackground);
      expect(await textContrast(selected)).toBeGreaterThanOrEqual(4.5);
      const last = page.getByRole("option").last();
      await expect(last).toHaveAttribute("data-highlighted", "");
      await expect(last).toHaveAttribute("aria-selected", "false");
      await expect(last).toHaveCSS("outline-style", "solid");
      expect(await textContrast(last)).toBeGreaterThanOrEqual(4.5);
      await page.keyboard.press("Home");
      await expect(selected).toHaveCSS("outline-style", "solid");
      await last.hover();
      await expect(last).toHaveCSS("outline-style", "none");
      await page.keyboard.press("Home");
      await expect(selected).toHaveCSS("outline-style", "solid");
    });
  }
}
