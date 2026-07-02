"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TimeBlock {
  id: number;
  taskTitle: string;
  startTime: number;
  endTime: number;
}

export default function DayViewPage() {
  const [date] = useState(() => new Date().toISOString().split("T")[0]);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (data.success) {
          setBlocks(
            data.data
              .filter((t: any) => t.status !== "unassigned")
              .slice(0, 3)
              .map((t: any, idx: number) => ({
                id: t.id,
                taskTitle: t.title,
                startTime: 9 + idx * 2,
                endTime: 11 + idx * 2,
              }))
          );
        }
      } catch (error) {
        console.error("Failed to load blocks:", error);
      }
    };

    loadBlocks();
  }, []);

  const hours = Array.from({ length: 15 }, (_, i) => i + 6);

  return (
    <div className="pt-20 max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">📅 일간 뷰</h1>
        <p className="text-gray-600 dark:text-gray-400">{date}</p>
      </div>

      <div className="space-y-3">
        {hours.map((hour) => {
          const block = blocks.find(
            (b) => b.startTime <= hour && hour < b.endTime
          );

          return (
            <div
              key={hour}
              className="flex gap-4 items-start border-b pb-3 dark:border-gray-700"
            >
              <div className="w-16 font-semibold">
                {String(hour).padStart(2, "0")}:00
              </div>
              <div className="flex-1">
                {block ? (
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded">
                    {block.taskTitle}
                  </div>
                ) : (
                  <div className="p-3 text-gray-300 dark:text-gray-600">
                    —
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
