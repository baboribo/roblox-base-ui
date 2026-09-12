import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import manifest from "../examples/manifest.json" with { type: "json" };
test("all component docs expose their real example source and individual URLs", async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const item of manifest) {
    await page.goto("/docs/components/" + item.id);
    await expect(
      page.getByRole("heading", { level: 1, name: item.name, exact: true }),
    ).toBeVisible();
    const example = page.locator(".docs-example").first();
    await example.getByRole("tab", { name: "코드", exact: true }).click();
    const source = readFileSync(
      new URL(`../examples/${item.id}.tsx`, import.meta.url),
      "utf8",
    ).replaceAll("../src/components/", "@/components/");
    expect((await example.locator("pre").textContent())?.trim()).toBe(
      source.trim(),
    );
    await expect(page.locator("main")).toContainText("pnpm ui add " + item.id);
  }
});
test("copy, loading example and controlled switch work in document frames", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/components/button");
  const example = page.locator(".docs-example").first();
  await example.getByRole("tab", { name: "코드", exact: true }).click();
  await example.getByRole("button", { name: /copy|コピー|복사/i }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("@/components/ui/button");
  expect(clipboard).toContain("export function ButtonExample");
  await page
    .locator('iframe[title="button-loading 예제"]')
    .scrollIntoViewIfNeeded();
  const loading = page.frameLocator('iframe[title="button-loading 예제"]');
  await loading.getByRole("button", { name: "저장", exact: true }).click();
  await expect(
    loading.getByRole("button", { name: "저장 중…" }),
  ).toBeDisabled();
  await expect(loading.getByRole("status").first()).toContainText(
    "저장했습니다.",
  );
  await page.goto("/docs/components/switch");
  const controlled = page.frameLocator(
    'iframe[title="switch-controlled 예제"]',
  );
  await controlled.getByRole("switch").click();
  await expect(controlled.getByRole("status")).toHaveText("자동 저장: 켜짐");
});
