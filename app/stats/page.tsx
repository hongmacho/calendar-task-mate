"use client";

export default function StatsPage() {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 통계</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">이번 주 작업 시간</p>
          <p className="text-3xl font-bold">24시간</p>
        </div>
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">완료율</p>
          <p className="text-3xl font-bold">65%</p>
        </div>
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">청구 가능 시간</p>
          <p className="text-3xl font-bold">18시간</p>
        </div>
      </div>
    </div>
  );
}
