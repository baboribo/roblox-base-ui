"use client";
import { Select } from "../src/components/ui/select";
const options = [
  "홈 화면",
  "프로젝트 관리",
  "에셋 라이브러리",
  "팀 대시보드",
  "사용자 설정",
  "알림 센터",
  "파일 탐색기",
  "작업 기록",
  "댓글 패널",
  "공유 설정",
  "검색 화면",
  "템플릿 목록",
  "미디어 뷰어",
  "팀 구성원만 열람할 수 있는 프로젝트",
  "도움말",
  "보관함",
].map((label, index) => ({
  label,
  value: `project-${index}`,
  disabled: index === 15,
}));
export function SelectLongListExample() {
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <Select
        label="프로젝트"
        options={options}
        defaultValue="project-0"
        description="보관함은 선택할 수 없는 항목입니다."
      />
    </div>
  );
}
