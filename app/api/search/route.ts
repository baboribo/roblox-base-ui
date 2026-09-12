import { source } from "@/docs/lib/source";
export const dynamic = "force-static";
export function GET() {
  return Response.json(
    source.getPages().map((page) => ({
      id: page.url,
      url: page.url,
      title: page.data.title,
      description: page.data.description ?? "",
      keywords: page.data.keywords,
      body: page.data.structuredData.contents.map((x) => x.content).join(" "),
    })),
  );
}
