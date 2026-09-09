import { ArrowUpRight } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import snapshot from "../../../tokens/roblox.snapshot.json";

export function SourcesPage() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">PROVENANCE · 2026.09.09</span>
        <h1>확인한 것과 구현한 것.</h1>
        <p>
          이 키트는 Roblox의 공식 배포물이나 내부 전체 복제본이 아닙니다. 출처를
          확인한 공개 토큰 위에 React 컴포넌트를 구현했습니다.
        </p>
      </div>
      <div className="source-cards">
        <article>
          <Badge>공식 배포 CSS</Badge>
          <h2>Roblox Foundation</h2>
          <p>
            기본 토큰 636개와 Default light/dark 의미 토큰.
            색상·간격·타이포그래피·크기·모션 값을 보존했습니다.
          </p>
          <a href={snapshot.provenance.css[0]} target="_blank" rel="noreferrer">
            FoundationCss.css <ArrowUpRight size={14} />
          </a>
        </article>
        <article>
          <Badge>회사 사이트</Badge>
          <h2>About Roblox</h2>
          <p>
            공유하는 색상 계열과 4px 간격, 8px 모서리를 확인했습니다. Builder
            Extended 제목과 데스크톱 dark 토큰은 참고 기록으로 보존하며 Default
            테마에는 적용하지 않습니다.
          </p>
          <a href="https://about.roblox.com" target="_blank" rel="noreferrer">
            about.roblox.com <ArrowUpRight size={14} />
          </a>
        </article>
        <article>
          <Badge>동작 구현</Badge>
          <h2>Base UI 1.8.0</h2>
          <p>
            모든 상호작용 프리미티브는 @base-ui/react를 사용합니다. 카드·표 같은
            표시 요소는 의미 있는 HTML로 조합했습니다.
          </p>
          <a
            href="https://base-ui.com/react/overview/quick-start"
            target="_blank"
            rel="noreferrer"
          >
            Base UI 문서 <ArrowUpRight size={14} />
          </a>
        </article>
        <article>
          <Badge>접근 불가</Badge>
          <h2>WebBlox 내부 저장소</h2>
          <p>
            github.rbx.com은 HTTP 421을 반환했습니다. 내부 컴포넌트 목록·Figma
            원본·제품별 예외 규칙은 확보하지 못했습니다. 검색에서 발견한 비공식
            미러의 소스는 가져오지 않았습니다.
          </p>
        </article>
      </div>
      <div className="notice">
        버튼·입력·메뉴·다이얼로그·Chat의 배포 규칙을 반영했습니다. Chat과
        Default 예제는 원본 CSS의 glyph 38개를 사용하고, 기존 카탈로그 일부는
        Lucide를 사용합니다. 전체가 원본과 픽셀 단위로 동일하다고 검증하지
        않았습니다. Roblox 폰트는 공개 URL을 참조하며 파일을 재배포하지
        않습니다.
      </div>
    </>
  );
}
