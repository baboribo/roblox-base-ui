import { expect, test } from "@playwright/test";

for (const example of ["select", "select-multiple"]) {
  for (const edge of ["left", "right", "full", "bottom"]) {
    test(`${example} stays attached at the ${edge} viewport edge`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 375, height: 700 });
      await page.goto(`/preview/${example}`);
      const trigger = page.getByRole("combobox");
      await trigger.evaluate((el, edge) => {
        const field = el.closest<HTMLElement>(".rbx-attached-field")!;
        Object.assign(field.style, {
          position: "fixed",
          width: edge === "full" ? "100vw" : "320px",
          left: edge === "right" ? "auto" : "0px",
          right: edge === "right" ? "0px" : "auto",
          top: edge === "bottom" ? "auto" : "40px",
          bottom: edge === "bottom" ? "0px" : "auto",
        });
      }, edge);
      await trigger.click();
      const popup = page.locator(".rbx-attached-popup");
      async function expectAttached() {
        await expect
          .poll(async () => {
            const button = await trigger.boundingBox();
            const panel = await popup.boundingBox();
            const header = await popup
              .locator(".rbx-attached-header")
              .boundingBox();
            if (!button || !panel || !header) return Infinity;
            return Math.max(
              Math.abs(button.x - panel.x),
              Math.abs(button.width - panel.width),
              Math.abs(button.y + 1 - header.y),
            );
          })
          .toBeLessThan(1);
        const panel = (await popup.boundingBox())!;
        expect(panel.x).toBeGreaterThanOrEqual(0);
        expect(panel.x + panel.width).toBeLessThanOrEqual(
          page.viewportSize()!.width,
        );
      }
      await expectAttached();
      if (edge === "bottom")
        await expect(popup).toHaveAttribute("data-side", "top");
      await page.setViewportSize({ width: 420, height: 740 });
      await expectAttached();
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
      await trigger.click();
      await expectAttached();
    });
  }
}
