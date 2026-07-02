import Link from "next/link";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          📅 CalendarTaskMate
        </Link>
        <div className="flex gap-6">
          <Link href="/calendar" className="hover:text-blue-600">
            캘린더
          </Link>
          <Link href="/tasks" className="hover:text-blue-600">
            작업
          </Link>
          <Link href="/stats" className="hover:text-blue-600">
            통계
          </Link>
        </div>
      </div>
    </nav>
  );
}
