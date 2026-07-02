"use client";

import { useState, useMemo } from "react";

interface TimeBlock {
  id: number;
  taskTitle: string;
  startTime: Date;
  endTime: Date;
  projectColor: string;
}

interface Task {
  id: number;
  title: string;
  hours: number;
  projectColor: string;
}

export default function CalendarPage() {
  const [weekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1);
    return d;
  });

  const [tasks] = useState<Task[]>([
    { id: 1, title: "프로젝트 A - 기획", hours: 2, projectColor: "bg-blue-500" },
    { id: 2, title: "프로젝트 B - 개발", hours: 3, projectColor: "bg-purple-500" },
  ]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const days = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📅 주간 캘린더</h1>

      {/* Backlog */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="font-semibold mb-3">📋 미배정 작업</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              draggable
              className={`p-3 rounded ${task.projectColor} text-white cursor-move hover:opacity-80`}
            >
              {task.title} ({task.hours}시간)
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border p-2 w-16">시간</th>
              {days.map((day) => (
                <th key={day} className="border p-2 min-w-32">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="border p-2 font-semibold bg-gray-50 dark:bg-gray-800">
                  {String(hour).padStart(2, "0")}:00
                </td>
                {days.map((_, dayIdx) => (
                  <td
                    key={`${hour}-${dayIdx}`}
                    className="border p-2 min-h-12 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onDragOver={(e) => e.preventDefault()}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
