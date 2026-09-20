import test from "node:test";
import assert from "node:assert/strict";
import { paginationItems } from "../src/lib/pagination";

test("pagination always includes current and boundary pages without duplicates", () => {
  for (let count = 1; count <= 100; count++) {
    for (let page = 1; page <= count; page++) {
      const items = paginationItems(page, count);
      const numbers = items.filter(
        (item): item is number => typeof item === "number",
      );
      assert.ok(numbers.includes(page));
      assert.equal(numbers[0], 1);
      assert.equal(numbers.at(-1), count);
      assert.equal(new Set(items).size, items.length);
      assert.ok(items.length <= 7);
      assert.deepEqual(
        [...numbers].sort((a, b) => a - b),
        numbers,
      );
      for (let i = 1; i < items.length - 1; i++) {
        if (typeof items[i] === "string")
          assert.ok(Number(items[i + 1]) - Number(items[i - 1]) > 2);
      }
    }
  }
  assert.equal(paginationItems(500_000, 1_000_000).length, 7);
});
