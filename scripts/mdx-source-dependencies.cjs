const path = require("node:path");

// 속성표는 MDX 외부의 TS 타입과 JSDoc을 읽습니다. 이 의존성을 webpack에 알려
// 컴포넌트만 수정해도 이전 빌드의 속성표가 재사용되지 않게 합니다.
module.exports = function mdxSourceDependencies(source) {
  if (/<auto-type-table\b/.test(source)) {
    this.addContextDependency(path.join(this.rootContext, "src"));
  }
  return source;
};
