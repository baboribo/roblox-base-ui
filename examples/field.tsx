"use client";

import { Field } from "../src/components/ui/field";

export function FieldExample() {
  return (
    <Field.Root>
      <Field.Label>연락 이메일</Field.Label>
      <Field.Control type="email" placeholder="you@example.com" required />
      <Field.Description>업데이트 안내를 받을 주소입니다.</Field.Description>
      <Field.Error match="typeMismatch">
        이메일 형식을 확인해주세요.
      </Field.Error>
      <Field.Error match="valueMissing">이메일을 입력하세요.</Field.Error>
    </Field.Root>
  );
}
