import { test, expect } from "@playwright/test";

for (const method of ["pointer", "keyboard"] as const) {
  for (const selected of ["first", "second"] as const) {
    test(`${method}, ${selected}: opening multi-select does not scroll clipping ancestors or reverse the list motion`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("/preview/select-motion-study");
      await page
        .getByRole("button", { name: "다중 선택", exact: true })
        .click();
      await page
        .getByRole("button", { name: "모션 보기", exact: true })
        .click();
      await expect(page.locator(".rbx-attached-popup")).toBeHidden();
      if (selected === "second")
        await page
          .getByRole("button", { name: "외부에서 두 번째 값 지정" })
          .click();
      const trigger = page.getByRole("combobox");
      if (method === "pointer") await trigger.click();
      else {
        await trigger.focus();
        await page.keyboard.press("ArrowDown");
      }
      await expect(page.locator(".rbx-attached-popup")).toHaveAttribute(
        "data-open",
        "",
      );
      const samples = await page.evaluate(async () => {
        const frames: { scroll: number[]; itemY: number }[] = [];
        for (let i = 0; i < 30; i++) {
          await new Promise(requestAnimationFrame);
          const popup = document.querySelector<HTMLElement>(
            ".rbx-attached-popup",
          )!;
          if (
            !popup.getBoundingClientRect().height ||
            Number(getComputedStyle(popup.parentElement!).opacity) === 0
          )
            continue;
          const item = popup.querySelector<HTMLElement>(
            ".rbx-attached-option",
          )!;
          const header = popup.querySelector<HTMLElement>(
            ".rbx-attached-header",
          )!;
          frames.push({
            scroll: [
              popup,
              popup.querySelector<HTMLElement>(".rbx-attached-reveal")!,
              popup.querySelector<HTMLElement>(".rbx-attached-clip")!,
            ].map((el) => el.scrollTop),
            itemY:
              item.getBoundingClientRect().y -
              header.getBoundingClientRect().bottom,
          });
        }
        return frames;
      });
      expect(samples.length).toBeGreaterThan(15);
      expect(Math.max(...samples.flatMap((frame) => frame.scroll))).toBe(0);
      for (let i = 1; i < samples.length; i++)
        expect(samples[i].itemY).toBeLessThanOrEqual(
          samples[i - 1].itemY + 0.5,
        );
      await expect(
        page.getByRole("option", {
          name: selected === "first" ? "디자인" : "개발",
          exact: true,
        }),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    });
  }
}
