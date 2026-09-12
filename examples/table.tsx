"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../src/components/ui/table";

export function TableExample() {
  return (
    <Table>
      <TableCaption>예제 프로젝트 목록</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">프로젝트</TableHead>
          <TableHead scope="col">상태</TableHead>
          <TableHead scope="col">업데이트</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["First world", "공개", "오늘"],
          ["Studio space", "비공개", "어제"],
          ["Night drive", "초안", "9월 7일"],
        ].map((row) => (
          <TableRow key={row[0]}>
            {row.map((cell) => (
              <TableCell key={cell}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
