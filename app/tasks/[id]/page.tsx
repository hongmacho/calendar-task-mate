import { notFound } from "next/navigation";
import Link from "next/link";
import { taskRepository } from "@/src/repositories/task.repository";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await taskRepository.findById(Number(id));

  if (!task) {
    notFound();
  }

  const statusLabels: Record<string, string> = {
    unassigned: "미배정",
    assigned: "배정됨",
    in_progress: "진행 중",
    completed: "완료",
  };

  return (
    <div className="pt-20 max-w-2xl mx-auto p-6">
      <Link href="/tasks" className="text-blue-600 hover:underline mb-4 block">
        ← 작업 목록으로 돌아가기
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{task.title}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            ID: {task.id} · 생성일: {new Date(task.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>

        {task.description && (
          <div className="mb-6 pb-6 border-b dark:border-gray-700">
            <h2 className="font-semibold mb-2">📝 설명</h2>
            <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">상태</p>
            <p className="text-lg font-semibold">
              {statusLabels[task.status as keyof typeof statusLabels] || task.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">예상 시간</p>
            <p className="text-lg font-semibold">{task.estimatedHours}시간</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✏️ 수정
          </Link>
          <button
            onClick={() => {
              if (confirm("정말 삭제하시겠습니까?")) {
                fetch(`/api/tasks/${task.id}`, { method: "DELETE" }).then(() => {
                  window.location.href = "/tasks";
                });
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
