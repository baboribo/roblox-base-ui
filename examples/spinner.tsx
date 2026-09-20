import { Spinner } from "../src/components/ui/spinner";
export function SpinnerExample() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <Spinner size="sm" label="작은 로딩 표시" />
      <Spinner label="기본 로딩 표시" />
      <Spinner size="lg" label="큰 로딩 표시" />
    </div>
  );
}
