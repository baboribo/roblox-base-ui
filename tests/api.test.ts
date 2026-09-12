import test from "node:test";
import assert from "node:assert/strict";
import { createProject } from "fumadocs-typescript";
import { createApiGenerator } from "../docs/lib/api-generator";

test("API docs resolve source unions, required fields and defaults without inherited DOM noise", async () => {
  const project = await createProject();
  try {
    const generator = createApiGenerator(project);
    const [button] = await generator.generateDocumentation(
      { path: "src/components/ui/button.tsx" },
      "ButtonProps",
    );
    assert.deepEqual(button.entries.map((entry) => entry.name).sort(), [
      "size",
      "variant",
    ]);
    const size = button.entries.find((entry) => entry.name === "size")!;
    for (const value of ["xs", "sm", "md", "lg"])
      assert.ok(size.type.includes(JSON.stringify(value)));
    assert.equal(size.required, false);
    assert.equal(
      size.tags.find((tag) => tag.name === "defaultValue")?.text,
      '"lg"',
    );
    const [icon] = await generator.generateDocumentation(
      { path: "src/components/ui/icon-button.tsx" },
      "IconButtonProps",
    );
    assert.equal(
      icon.entries.find((entry) => entry.name === "aria-label")?.required,
      true,
    );
    assert.equal(
      icon.entries.find((entry) => entry.name === "icon")?.required,
      true,
    );
    assert.equal(
      icon.entries
        .find((entry) => entry.name === "circular")
        ?.tags.find((tag) => tag.name === "defaultValue")?.text,
      "false",
    );
    assert.ok(!icon.entries.some((entry) => entry.name === "onClick"));
    const [switchDoc] = await generator.generateDocumentation(
      { path: "src/components/ui/switch.tsx" },
      "SwitchRootProps",
    );
    assert.deepEqual(
      switchDoc.entries.map((entry) => entry.name),
      ["size"],
    );
    assert.equal(
      switchDoc.entries[0].tags.find((tag) => tag.name === "defaultValue")
        ?.text,
      '"md"',
    );
  } finally {
    project.close();
  }
});
