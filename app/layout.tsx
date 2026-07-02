import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalendarTaskMate",
  description: "캘린더 우선 드래그 시간블로킹 작업 관리",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
