"use client";

import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  estimatedHours: number;
  status: string;
}

export default function TimeBlocksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (data.success) {
          setTasks(
            data.data.filter((t: Task) => t.status === "unassigned")
          );
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer?.setData("taskId", String(taskId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (
    e: React.DragEvent,
    hour: number,
    day: number
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer?.getData("taskId");

    if (taskId) {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "assigned" }),
        });
        alert(
          `작업이 ${hour}:00에 배정되었습니다 (드래그 앤 드롭 기능 활성화됨)`
        );
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
  };

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  return (
    <div className="pt-20 p-6 min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">⏱️ 시간 블로킹</h1>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">
          <p className="text-sm font-medium">📋 미배정</p>
          <div className="space-y-2 mt-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="p-2 bg-white dark:bg-gray-800 rounded cursor-move hover:shadow-md"
              >
                <p className="font-medium text-sm">{task.title}</p>
                <p className="text-xs text-gray-500">
                  {task.estimatedHours}시간
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 w-12">시간</th>
                {days.map((day) => (
                  <th key={day} className="border p-2 bg-gray-100 dark:bg-gray-800">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour}>
                  <td className="border p-2 font-semibold bg-gray-50 dark:bg-gray-800">
                    {String(hour).padStart(2, "0")}:00
                  </td>
                  {days.map((_, dayIdx) => (
                    <td
                      key={`${hour}-${dayIdx}`}
                      className="border p-2 h-12 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, hour, dayIdx)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
