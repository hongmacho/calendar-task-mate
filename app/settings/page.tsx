"use client";

export default function SettingsPage() {
  return (
    <div className="pt-20 max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">⚙️ 설정</h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 데이터 관리</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            📥 CSV로 내보내기
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📚 기본 설정</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span>어두운 모드</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span>알림 활성화</span>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">정보</h2>
          <p className="text-gray-600 dark:text-gray-400">
            CalendarTaskMate v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
