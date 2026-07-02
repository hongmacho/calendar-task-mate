"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimatedHours: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimatedHours: Number(formData.estimatedHours),
        }),
      });

      if (response.ok) {
        router.push("/tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">✏️ 새 작업 추가</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg space-y-4"
      >
        <input
          type="text"
          required
          placeholder="제목"
          className="w-full border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="설명"
          rows={3}
          className="w-full border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="number"
          min="0.5"
          step="0.5"
          placeholder="시간"
          className="w-full border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
          value={formData.estimatedHours}
          onChange={(e) =>
            setFormData({ ...formData, estimatedHours: e.target.value })
          }
        />
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "저장 중..." : "저장"}
          </button>
          <Link
            href="/tasks"
            className="px-6 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
