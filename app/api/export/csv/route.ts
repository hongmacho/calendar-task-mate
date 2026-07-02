import "server-only";

import { taskRepository } from "@/src/repositories/task.repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await taskRepository.findAll();

    const csv = [
      ["ID", "제목", "설명", "상태", "시간", "생성일"].join(","),
      ...tasks.map((t) =>
        [
          t.id,
          `"${t.title}"`,
          `"${t.description || ""}"`,
          t.status,
          t.estimatedHours,
          new Date(t.createdAt).toISOString().split("T")[0],
        ].join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="tasks-' +
          new Date().toISOString().split("T")[0] +
          '.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "내보내기 실패" },
      { status: 500 }
    );
  }
}
