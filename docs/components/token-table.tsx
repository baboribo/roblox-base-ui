"use client";
import { useState } from "react";
import snapshot from "@/tokens/roblox.snapshot.json";
export function TokenTable() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const rows = Object.entries(snapshot.foundation).filter(([name, value]) =>
    (name + " " + value).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <label htmlFor="token-query">토큰 검색</label>
      <input
        id="token-query"
        className="token-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="이름 또는 값"
      />
      <p role="status">{status || `${rows.length}개`}</p>
      <div className="token-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">이름</th>
              <th scope="col">값</th>
              <th scope="col">복사</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, value]) => (
              <tr key={name}>
                <td>
                  <code>{name.replace("--", "--rbx-")}</code>
                </td>
                <td>
                  <code>{value}</code>
                </td>
                <td>
                  <button
                    aria-label={`${name} 복사`}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          `var(${name.replace("--", "--rbx-")})`,
                        );
                        setStatus("복사했습니다.");
                      } catch {
                        setStatus("복사하지 못했습니다.");
                      }
                    }}
                  >
                    복사
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
