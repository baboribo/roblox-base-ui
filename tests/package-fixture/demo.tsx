"use client";
import { useState } from "react";
import { Button, Switch } from "ply-ui";
import { Input } from "ply-ui/input";
import { Stack } from "ply-ui/layout";
import { Select } from "ply-ui/select";
import { Dialog } from "ply-ui/dialog";
import { Pagination } from "ply-ui/pagination";
import { Textarea } from "ply-ui/textarea";
import { Tooltip } from "ply-ui/tooltip";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
} from "ply-ui/table";

export default function Demo() {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  return (
    <main style={{ maxWidth: 320, padding: 24, display: "grid", gap: 16 }}>
      <Stack>
        <Button className="h-16 min-h-0 rounded-none">사용자 크기</Button>
        <Input aria-label="장식 입력" leading="@" className="w-40" />
      </Stack>
      <Button onClick={() => setCount(count + 1)}>저장</Button>
      <p role="status">저장 {count}회</p>
      <Switch.Root aria-label="알림">
        <Switch.Thumb />
      </Switch.Root>
      <Select
        label="공개 범위"
        defaultValue="public"
        options={[
          { value: "public", label: "전체 공개" },
          { value: "private", label: "비공개" },
        ]}
      />
      <Select
        multiple
        label="분야"
        defaultValue={["design"]}
        options={[
          { value: "design", label: "디자인" },
          { value: "development", label: "개발" },
        ]}
      />
      <section data-theme="dark">
        <Dialog.Root>
          <Dialog.Trigger>설치 대화상자</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup>
              <Dialog.Title>설치 확인</Dialog.Title>
              <Dialog.Description>영역 테마를 유지합니다.</Dialog.Description>
              <Dialog.Close>닫기</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </section>
      <Pagination pageCount={1000} page={page} onPageChange={setPage} />
      <p data-testid="page-result">{page}</p>
      <Textarea aria-label="설치 설명" rows={8} />
      <Button loading>처리 중인 버튼</Button>
      <Button
        loading
        nativeButton={false}
        render={<a href="#destination">설치 링크</a>}
      />
      <Tooltip.Root>
        <Tooltip.Trigger delay={0}>설치 도움말</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>패키지 도움말 설명</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Table>
        <TableCaption>설치 표</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>{"long-project-name".repeat(10)}</TableCell>
            <TableCell>2026-09-20</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
