"use client";

import { useState } from "react";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "unassigned" | "assigned" | "in_progress" | "completed";
  hours: number;
  project: string;
}

const statusLabels: Record<Task["status"], string> = {
  unassigned: "미배정",
  assigned: "배정됨",
  in_progress: "진행 중",
  completed: "완료",
};

const statusColors: Record<Task["status"], string> = {
  unassigned: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  assigned: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "프로젝트 A - UI 디자인",
      description: "프로토타입 완성",
      status: "unassigned",
      hours: 4,
      project: "프로젝트 A",
    },
    {
      id: 2,
      title: "프로젝트 B - 데이터베이스 설계",
      description: "스키마 검토 필요",
      status: "in_progress",
      hours: 6,
      project: "프로젝트 B",
    },
    {
      id: 3,
      title: "문서 작성",
      description: "API 문서 완성",
      status: "completed",
      hours: 3,
      project: "내부",
    },
  ]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">✅ 작업 관리</h1>
        <Link
          href="/tasks/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + 새 작업
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[task.status]
                }`}
              >
                {statusLabels[task.status]}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {task.description}
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>📁 {task.project}</span>
              <span>⏱️ {task.hours}시간</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
