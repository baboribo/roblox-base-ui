import { useState } from "react";
import { Code2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SelectExample, SliderExample, SwitchExample } from "../examples/forms";
import { DialogExample } from "../examples/overlays";

export function RecipesPage() {
  const [saved, setSaved] = useState(false);
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">COMPOSITION</span>
        <h1>파트를 연결하면 화면이 됩니다.</h1>
        <p>입력, 선택, 토글과 버튼을 하나의 설정 화면으로 조합했습니다.</p>
      </div>
      <div className="recipe-grid">
        <section className="recipe-panel">
          <h2>경험 설정</h2>
          <p className="muted">내 경험에 참여할 수 있는 사람을 관리하세요.</p>
          <SelectExample />
          <SliderExample />
          <SwitchExample />
          <Button variant="emphasis" onClick={() => setSaved(true)}>
            설정 저장
          </Button>
          {saved && <p role="status">이 브라우저 예제에 적용했습니다.</p>}
        </section>
        <section className="recipe-panel">
          <span className="eyebrow">ACTION & FEEDBACK</span>
          <h2>집중해서 편집하기</h2>
          <p className="muted">모달 안에서도 동일한 토큰이 이어집니다.</p>
          <DialogExample />
          <div className="recipe-note">
            <Code2 size={20} />
            <p>
              구조는 React,
              <br />
              동작은 Base UI,
              <br />
              모양은 내 CSS.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
