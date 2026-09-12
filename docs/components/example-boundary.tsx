"use client";
import { Component, type ReactNode } from "react";

/** 예제의 렌더링/청크 로딩 오류가 나도 문서 본문과 소스 코드는 계속 사용할 수 있습니다. */
export class ExampleBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div role="alert" aria-label="예제 오류" className="example-error">
          <p>예제를 표시하지 못했습니다.</p>
          <button type="button" onClick={() => window.location.reload()}>
            예제 다시 불러오기
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
