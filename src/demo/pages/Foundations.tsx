import { useState } from "react";
import { Input } from "../../components/ui/input";
import snapshot from "../../../tokens/roblox.snapshot.json";
import { CopyButton } from "../SourceBlock";

export function FoundationPage() {
  const [query, setQuery] = useState("");
  const entries = Object.entries(snapshot.foundation).filter(([key]) =>
    key.includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">FOUNDATIONS</span>
        <h1>작은 값이 만드는 일관성.</h1>
        <p>
          Roblox 배포 CSS에서 추출한 원본 값입니다. 변수에는 충돌을 막는{" "}
          <code>--rbx-</code> 접두사를 붙였습니다.
        </p>
      </div>
      <div className="swatch-grid">
        {[
          "gray-1200",
          "gray-1100",
          "gray-1000",
          "gray-900",
          "blue-700",
          "gray-100",
        ].map((name) => (
          <div className="swatch" key={name}>
            <div style={{ background: `var(--rbx-color-extended-${name})` }} />
            <strong>{name}</strong>
            <code>
              {
                snapshot.foundation[
                  `--color-extended-${name}` as keyof typeof snapshot.foundation
                ]
              }
            </code>
          </div>
        ))}
      </div>
      <div className="type-specimens">
        <div>
          <span className="eyebrow">BODY · BUILDER SANS</span>
          <p>Build. Play. Make it yours.</p>
        </div>
        <div>
          <span className="eyebrow">HEADING · BUILDER SANS</span>
          <p>
            Make something
            <br />
            that matters.
          </p>
        </div>
      </div>
      <div className="demo-row between">
        <h2>
          토큰 탐색 <small>{entries.length}</small>
        </h2>
        <Input
          aria-label="토큰 검색"
          placeholder="radius, surface, typography…"
          value={query}
          onValueChange={setQuery}
          style={{ maxWidth: 320 }}
        />
      </div>
      <div className="token-table">
        <table>
          <thead>
            <tr>
              <th scope="col">원본 이름</th>
              <th scope="col">원본 값</th>
              <th scope="col">복사</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, value]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>
                  <code>{value}</code>
                </td>
                <td>
                  <CopyButton
                    label="CSS"
                    text={`var(${name.replace("--", "--rbx-")})`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!entries.length && (
          <p className="empty-search">검색 결과가 없습니다.</p>
        )}
      </div>
    </>
  );
}
