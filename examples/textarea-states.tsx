import { Textarea } from "../src/components/ui/textarea";
export function TextareaStatesExample() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <label>
        짧은 메모
        <Textarea rows={3} controlSize="sm" variant="contrast" />
      </label>
      <label>
        긴 설명
        <Textarea rows={8} />
      </label>
      <label>
        오류가 있는 소개
        <Textarea
          aria-invalid="true"
          aria-describedby="intro-error"
          defaultValue=""
        />
      </label>
      <p id="intro-error">소개를 입력하세요.</p>
    </div>
  );
}
