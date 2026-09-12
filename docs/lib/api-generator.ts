import {
  createGenerator,
  type Generator,
  type Project,
} from "fumadocs-typescript";

export function createApiGenerator(project?: Project): Generator {
  // 빌드마다 원본 타입을 읽습니다. 외부 타입이 바뀌어도 오래된 캐시가 남지 않습니다.
  const base = createGenerator({ project, cache: false });
  return {
    async generateDocumentation(file, name, options) {
      const documents = await base.generateDocumentation(file, name, {
        typeSimplifier: { shouldSimplify: () => false },
        ...options,
        transform(entry, type, symbol) {
          options?.transform?.call(this, entry, type, symbol);
          // React/HTML의 수백 개 공통 속성 대신 이 프로젝트가 정의한 속성을 표시합니다.
          const local = symbol.declarations.some(
            (declaration) =>
              !declaration.path
                .replaceAll("\\", "/")
                .includes("/node_modules/"),
          );
          if (!local) entry.tags.push({ name: "external", text: "" });
        },
      });
      if (name && documents.length === 0)
        throw new Error(`속성표 타입을 찾을 수 없습니다: ${file.path}#${name}`);
      return documents.map((document) => ({
        ...document,
        entries: document.entries.filter(
          (entry) => !entry.tags.some((tag) => tag.name === "external"),
        ),
      }));
    },
    generateTypeTable(props, options) {
      return base.generateTypeTable.call(this, props, options);
    },
  };
}
