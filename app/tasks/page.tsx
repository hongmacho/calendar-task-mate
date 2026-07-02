"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "unassigned" | "assigned" | "in_progress" | "completed";
  estimatedHours: number;
}

const statusLabels: Record<string, string> = {
  unassigned: "미배정",
  assigned: "배정됨",
  in_progress: "진행 중",
  completed: "완료",
};

const statusColors: Record<string, string> = {
  unassigned: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  assigned: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (data.success) {
          setTasks(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="pt-20 p-6 text-center">
        <p className="text-gray-500">작업을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">✅ 작업 관리</h1>
          <Link
            href="/tasks/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ 새 작업
          </Link>
        </div>

        {/* 검색 및 필터 UI */}
        <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div>
            <input
              type="text"
              placeholder="작업을 검색하세요"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-4 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">상태 필터</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded px-4 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            >
              <option value="">모든 상태</option>
              <option value="unassigned">미배정</option>
              <option value="assigned">배정됨</option>
              <option value="in_progress">진행 중</option>
              <option value="completed">완료</option>
            </select>
          </div>

          {(search || statusFilter) && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>

      {/* 작업 목록 */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {search || statusFilter ? "검색 결과가 없습니다" : "작업이 없습니다"}
          </p>
          {!search && !statusFilter && (
            <Link
              href="/tasks/new"
              className="text-blue-600 hover:underline"
            >
              새 작업 추가하기
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="block p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      statusColors[task.status] || statusColors.unassigned
                    }`}
                  >
                    {statusLabels[task.status] || task.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {task.estimatedHours}시간
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
