export default function NotFound() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>주소를 확인하거나 문서 목록으로 이동하세요.</p>
      <a href="/docs">문서 목록</a>
    </main>
  );
}
