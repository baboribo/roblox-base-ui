"use client";
import { Input } from "../src/components/ui/input";
import { Field } from "../src/components/ui/field";
export function InputInvalidExample() {
  return (
    <Field.Root invalid>
      <Field.Label>프로젝트 이름</Field.Label>
      <Input />
      <Field.Error match={true}>프로젝트 이름을 입력하세요.</Field.Error>
    </Field.Root>
  );
}
