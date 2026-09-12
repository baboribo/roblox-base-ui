import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { exampleNames } from "../examples/names";

test("every registered focused example renders without runtime errors", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const name of exampleNames) {
    await page.goto(`/preview/${name}?theme=light`);
    await expect(
      page.locator('.preview-content [class*="rbx-"]').first(),
      name,
    ).toBeAttached();
    await expect(page.getByRole("alert", { name: "예제 오류" })).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test("Select and Menu sizes are independently operable and part APIs show their defaults", async ({
  page,
}) => {
  for (const component of ["select", "menu"]) {
    await page.goto(`/docs/components/${component}`);
    for (const size of ["xs", "sm", "md", "lg"]) {
      const card = page.locator(`[data-example="${component}-${size}"]`);
      await card.scrollIntoViewIfNeeded();
      const frame = card.locator("iframe").contentFrame();
      const trigger = frame.getByRole(
        component === "select" ? "combobox" : "button",
      );
      await trigger.click();
      await expect(frame.locator(".rbx-popup")).toHaveAttribute(
        "data-size",
        size,
      );
      await expect(frame.locator(".rbx-popup")).toBeVisible();
      if (component === "select") {
        await expect(trigger).toHaveAttribute("data-size", size);
        await frame.getByRole("option", { name: "친구만" }).click();
        await expect(trigger).toContainText("친구만");
      } else await frame.getByRole("menuitem", { name: "복제" }).click();
      await expect(frame.locator(".rbx-popup")).toBeHidden();
      await card.getByRole("tab", { name: "코드", exact: true }).click();
      await expect(card.locator("pre")).toContainText(`size="${size}"`);
    }
    const part =
      component === "select" ? "SelectTriggerProps" : "MenuPopupProps";
    const api = page.locator(`[id="type-table-${component}.tsx-${part}"]`);
    await api.getByRole("button", { name: /^size/ }).click();
    await expect(api).toContainText(component === "select" ? '"lg"' : '"md"');
  }
  await page.goto("/preview/select-mixed-sizes");
  await page.getByRole("combobox").click();
  await expect(page.getByRole("combobox")).toHaveAttribute("data-size", "sm");
  await expect(page.locator(".rbx-popup")).toHaveAttribute("data-size", "lg");
});

test("multiple selection, controlled settings and manual tabs are functional", async ({
  page,
}) => {
  await page.goto("/preview/combobox-multiple");
  await page.getByRole("combobox").fill("Spo");
  await page.getByRole("option", { name: "Sports" }).click();
  await expect(page.getByRole("button", { name: "Sports 삭제" })).toBeVisible();
  await page.getByRole("button", { name: "Racing 삭제" }).click();
  await expect(page.getByRole("button", { name: "Racing 삭제" })).toHaveCount(
    0,
  );
  await page.goto("/preview/checkbox-group-controlled");
  await page.getByRole("checkbox", { name: "push" }).click();
  await expect(page.getByRole("status")).toContainText("email, push");
  await page.goto("/preview/radio-group-controlled");
  await page.getByRole("radio", { name: "private" }).click();
  await expect(page.getByRole("status")).toContainText("private");
  await page.goto("/preview/tabs-manual");
  await page.getByRole("tab", { name: "정보" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "설정" })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("프로젝트 정보");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("tabpanel", { name: "설정" })).toContainText(
    "프로젝트 설정",
  );
  await page.goto("/preview/menu-submenu");
  await page.getByRole("button", { name: "프로젝트 메뉴" }).click();
  await page.getByRole("menuitem", { name: "내보내기" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menuitem", { name: "PNG" })).toBeVisible();
});

test("compound docs fit mobile and expose accessible code, APIs and overlays", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of [
    "select",
    "menu",
    "dialog",
    "icon-button",
    "combobox",
    "list",
  ]) {
    await page.goto(`/docs/components/${name}`);
    const card = page.locator(".docs-example").first();
    await card.getByRole("tab", { name: "코드", exact: true }).click();
    await expect(card.locator("pre")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    const result = await new AxeBuilder({ page })
      .include(".docs-example")
      .analyze();
    expect(
      result.violations.map((v) => ({
        name,
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});

test("input error example connects visual and accessible validation state", async ({
  page,
}) => {
  await page.goto("/preview/input-invalid");
  const input = page.getByRole("textbox", { name: "프로젝트 이름" });
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("data-invalid", "");
  await expect(input).toHaveAccessibleDescription(
    "프로젝트 이름을 입력하세요.",
  );
});

test("Select multiple keeps the popup usable while adding and removing values", async ({
  page,
}) => {
  await page.goto("/preview/select-multiple");
  const trigger = page.getByRole("combobox");
  await trigger.click();
  await expect(page.getByRole("option", { name: "친구만" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("option", { name: "친구만" }).click();
  await expect(page.getByRole("option", { name: "친구만" })).toHaveAttribute(
    "aria-selected",
    "false",
  );
  await page.getByRole("option", { name: "비공개" }).click();
  await page.keyboard.press("Escape");
  await expect(trigger).toContainText("비공개");
});
