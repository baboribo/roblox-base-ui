"use client";
import { useState } from "react";
import { Pagination } from "../src/components/ui/pagination";
const projects = Array.from(
  { length: 100 },
  (_, index) => `프로젝트 ${index + 1}`,
);
export function PaginationExample() {
  const [page, setPage] = useState(1);
  return (
    <div>
      <ul aria-label="프로젝트 목록">
        {projects.slice((page - 1) * 5, page * 5).map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <Pagination pageCount={20} page={page} onPageChange={setPage} />
      <p role="status">{page} / 20 페이지</p>
    </div>
  );
}
