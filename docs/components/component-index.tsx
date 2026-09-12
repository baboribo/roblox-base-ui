import Link from "next/link";
import { source } from "@/docs/lib/source";
export function ComponentIndex() {
  const pages = source
    .getPages()
    .filter((p) => p.slugs.length === 2 && p.slugs[0] === "components");
  return (
    <>
      {["입력", "탐색", "피드백", "콘텐츠"].map((group) => (
        <section key={group}>
          <h2>{group}</h2>
          <div className="component-grid">
            {pages
              .filter((p) => p.data.group === group)
              .map((p) => (
                <Link className="component-card" key={p.url} href={p.url}>
                  <strong>{p.data.title}</strong>
                  <span>{p.data.description}</span>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
