"use client";
import { useState } from "react";
import { Button } from "../src/components/ui/button";
import { Card, CardContent } from "../src/components/ui/card";
import { Tabs } from "../src/components/ui/tabs";
import { Pagination } from "../src/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../src/components/ui/table";

export function ResponsiveLayoutExample() {
  const [width, setWidth] = useState(320);
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
      <div
        aria-label="예제 영역 너비"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {[200, 320, 640].map((size) => (
          <Button
            key={size}
            size="sm"
            variant={width === size ? "standard" : "utility"}
            aria-pressed={width === size}
            onClick={() => setWidth(size)}
          >
            {size}px
          </Button>
        ))}
      </div>
      <Card style={{ width: "100%", maxWidth: width }}>
        <CardContent>
          <Button>선택한 프로젝트의 모든 변경사항 저장</Button>
          <Tabs.Root defaultValue={0}>
            <Tabs.List>
              {["프로젝트 정보", "팀 구성원", "변경 기록", "공유 설정"].map(
                (name, index) => (
                  <Tabs.Tab key={name} value={index}>
                    {name}
                  </Tabs.Tab>
                ),
              )}
              <Tabs.Indicator />
            </Tabs.List>
            {[
              "프로젝트 이름과 설명",
              "이 프로젝트에 참여한 구성원",
              "최근 저장한 변경사항",
              "공개 범위와 링크",
            ].map((text, index) => (
              <Tabs.Panel key={text} value={index}>
                {text}
              </Tabs.Panel>
            ))}
          </Tabs.Root>
          <Table>
            <TableCaption>프로젝트 변경 기록</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>파일</TableHead>
                <TableHead>변경한 사람</TableHead>
                <TableHead>수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRow key={row}>
                  <TableCell>
                    project-preview-{(page - 1) * 3 + row}.png
                  </TableCell>
                  <TableCell>디자인 팀</TableCell>
                  <TableCell>2026-09-20</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination pageCount={20} page={page} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}
