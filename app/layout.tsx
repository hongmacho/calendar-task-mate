import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalendarTaskMate",
  description: "캘린더 우선 드래그 시간블로킹 작업 관리",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navigation />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
