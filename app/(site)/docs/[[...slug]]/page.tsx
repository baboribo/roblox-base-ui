import { MdxPre } from "@/docs/components/mdx-pre";
import { notFound } from "next/navigation";
import { source } from "@/docs/lib/source";
import {
  DocsPage,
  DocsTitle,
  DocsDescription,
  DocsBody,
} from "fumadocs-ui/layouts/notebook/page";
import defaultComponents from "fumadocs-ui/mdx";
import { ComponentExample, ComponentSource } from "@/docs/components/example";
import { ComponentIndex } from "@/docs/components/component-index";
import { TokenTable } from "@/docs/components/token-table";
import { TypeTable } from "fumadocs-ui/components/type-table";
export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="component-guide">
        <MDX
          components={{
            ...defaultComponents,
            pre: MdxPre,
            ComponentExample,
            ComponentSource,
            ComponentIndex,
            TokenTable,
            TypeTable,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}
export function generateStaticParams() {
  return source.generateParams();
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  return { title: page?.data.title, description: page?.data.description };
}
