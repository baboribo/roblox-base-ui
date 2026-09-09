"use client";

import { Field } from "../../components/ui/field";
import { Input } from "../../components/ui/input";

export function InputExample() {
  return (
    <Field.Root>
      <Field.Label>프로젝트 이름</Field.Label>
      <Input placeholder="새로운 경험" />
      <Field.Description>언제든 이름을 변경할 수 있습니다.</Field.Description>
    </Field.Root>
  );
}
