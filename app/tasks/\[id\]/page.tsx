"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  estimatedHours: number;
}

export default function TaskDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const resolved = await paramsPromise;
      setParams(resolved);
    })();
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setTask(data.data);
          setStatus(data.data.status);
        }
      } catch (error) {
        console.error("Failed to fetch task:", error);
      }
    };

    fetchTask();
  }, [params]);

  const handleStatusChange = async (newStatus: string) => {
    if (!params || !task) return;

    try {
      const res = await fetch(`/api/tasks/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (!task) {
    return (
      <div className="pt-20 max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-500">작업을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-2xl mx-auto p-6">
      <Link href="/tasks" className="text-blue-600 hover:underline mb-4">
        ← 돌아가기
      </Link>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">{task.title}</h1>

        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {task.description}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="font-medium">상태</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="mt-2 border rounded px-3 py-2 w-full dark:bg-gray-900 dark:border-gray-700"
            >
              <option value="unassigned">미배정</option>
              <option value="assigned">배정됨</option>
              <option value="in_progress">진행 중</option>
              <option value="completed">완료</option>
            </select>
          </div>

          <div>
            <label className="font-medium">예상 시간</label>
            <p className="text-gray-600 dark:text-gray-400">
              {task.estimatedHours}시간
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
