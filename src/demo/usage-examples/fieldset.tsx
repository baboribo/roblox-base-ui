"use client";

import { Field } from "../../components/ui/field";
import { Fieldset } from "../../components/ui/fieldset";
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

export function FieldsetExample() {
  return (
    <Fieldset.Root>
      <Fieldset.Legend>프로필</Fieldset.Legend>
      <InputExample />
      <FieldExample />
    </Fieldset.Root>
  );
}
