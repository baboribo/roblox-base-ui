import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import { createApiGenerator } from "./docs/lib/api-generator";
export const docs = defineDocs({
  dir: "docs/content",
  docs: {
    schema: frontmatterSchema.extend({
      keywords: z.array(z.string()).default([]),
      group: z.string().optional(),
    }),
  },
});
export default defineConfig({
  mdxOptions: {
    remarkPlugins: [
      [
        remarkAutoTypeTable,
        {
          generator: createApiGenerator(),
          options: { basePath: process.cwd() },
          shiki: {
            themes: {
              light: "github-light-high-contrast",
              dark: "github-dark-high-contrast",
            },
          },
        },
      ],
    ],
    rehypeCodeOptions: {
      themes: {
        light: "github-light-high-contrast",
        dark: "github-dark-high-contrast",
      },
    },
  },
});
