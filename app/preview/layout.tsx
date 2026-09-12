import "@/src/styles/theme.css";
import "@/src/styles/fonts.css";
import "./preview.css";
export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 외부 JS 로딩을 기다리지 않고 예제 본문을 그리기 전에 테마를 지정합니다. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.dataset.theme = new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light';`,
        }}
      />
      {children}
    </>
  );
}
