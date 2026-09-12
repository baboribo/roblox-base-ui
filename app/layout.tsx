import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { default: "Roblox Base UI", template: "%s | Roblox Base UI" },
  description: "Base UI 기반 React 컴포넌트의 사용법과 예제입니다.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
