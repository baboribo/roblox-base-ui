import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import catalog from "../tokens/catalog.json" with { type: "json" };
async function choose(page: import("@playwright/test").Page, name: string) {
  await page
    .getByRole("navigation", { name: "컴포넌트 목록" })
    .getByRole("button", { name, exact: true })
    .click();
}
test("all 55 pages expose the actual preview source with complete installation guidance", async ({
  page,
}) => {
  await page.goto("/#components");
  for (const item of catalog) {
    const name = item.name
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
    await choose(page, name);
    const guide = page.getByRole("region", { name: "사용 예시", exact: true });
    await expect(guide).toBeVisible();
    const code = readFileSync(
      new URL(`../src/demo/usage-examples/${item.name}.tsx`, import.meta.url),
      "utf8",
    ).replaceAll('"../../components/ui/', '"@/components/ui/');
    expect(
      await guide
        .locator(".usage-steps > li")
        .nth(2)
        .locator("pre code")
        .textContent(),
    ).toBe(code);
    await expect(guide.locator(".usage-steps > li").first()).toContainText(
      "npm run ui -- add",
    );
    await expect(guide.locator(".usage-tips li")).toHaveCount(2);
  }
});
test("usage code copies correctly and the controlled switch and loading button work", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#components");
  const guide = page.getByRole("region", { name: "사용 예시", exact: true });
  const block = guide
    .locator(".usage-steps > li")
    .nth(2)
    .locator(".source-block");
  await block.getByRole("button", { name: "복사", exact: true }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("import { Button");
  expect(clipboard).toContain("@/components/ui/button");
  expect(clipboard).toContain("export function ButtonExample");
  expect(clipboard).not.toContain('className="demo-row"');
  const loading = page.getByRole("region", {
    name: "처리 중인 버튼",
    exact: true,
  });
  await loading.getByRole("button", { name: "예제 저장", exact: true }).click();
  await expect(
    loading.getByRole("button", { name: "저장 중…", exact: true }),
  ).toBeDisabled();
  await expect(loading.getByRole("status").first()).toContainText(
    "예제 저장 완료",
  );
  await choose(page, "Switch");
  const controlled = page.getByRole("region", {
    name: "상태를 직접 관리하기",
    exact: true,
  });
  await controlled.getByRole("switch", { name: "변경사항 자동 저장" }).click();
  await expect(controlled.getByRole("status").first()).toHaveText(
    "자동 저장: 켜짐",
  );
  await guide.locator("summary").click();
  await expect(guide).toContainText("npm install @base-ui/react@1.8.0");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: test.info().outputPath("usage-mobile.png") });
});
