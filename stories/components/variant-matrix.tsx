import type { ReactNode } from "react";
import "./variant-matrix.css";

type Axis<T extends string | number | boolean> = { value: T; label: string };

/** 행과 열의 모든 조합을 실제 컴포넌트로 렌더합니다. 값의 타입은 render까지 유지됩니다. */
export function VariantMatrix<
  R extends string | number | boolean,
  C extends string | number | boolean,
>({
  caption,
  rows,
  columns,
  render,
}: {
  caption: string;
  rows: readonly Axis<R>[];
  columns: readonly Axis<C>[];
  render: (row: R, column: C) => ReactNode;
}) {
  return (
    <div
      className="variant-matrix"
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">종류</th>
            {columns.map((column) => (
              <th key={String(column.value)} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row.value)}>
              <th scope="row">{row.label}</th>
              {columns.map((column) => (
                <td key={String(column.value)}>
                  {render(row.value, column.value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
