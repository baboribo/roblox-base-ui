import { notFound } from "next/navigation";
import { exampleNames } from "@/examples/names";
import { ExampleRenderer } from "@/examples/renderer";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ theme?: string; layout?: string }>;
}) {
  const { name } = await params;
  if (!exampleNames.has(name)) notFound();
  const { theme, layout } = await searchParams;
  return (
    <ExampleRenderer
      name={name}
      theme={theme === "dark" ? "dark" : "light"}
      layout={layout === "center" ? "center" : undefined}
    />
  );
}
