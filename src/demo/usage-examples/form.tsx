"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Field } from "../../components/ui/field";
import { Form } from "../../components/ui/form";

export function FieldExample() {
  return (
    <Field.Root>
      <Field.Label>연락 이메일</Field.Label>
      <Field.Control type="email" placeholder="you@example.com" required />
      <Field.Description>업데이트 안내를 받을 주소입니다.</Field.Description>
      <Field.Error match="typeMismatch">
        이메일 형식을 확인해주세요.
      </Field.Error>
      <Field.Error match="valueMissing">이메일을 입력해주세요.</Field.Error>
    </Field.Root>
  );
}

export function FormExample() {
  const [saved, setSaved] = useState(false);
  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <FieldExample />
      <Button type="submit" variant="emphasis">
        저장하기
      </Button>
      {saved && <p role="status">예제 폼이 저장되었습니다.</p>}
    </Form>
  );
}
