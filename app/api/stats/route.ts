import { taskRepository } from "@/src/repositories/task.repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await taskRepository.getStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "통계 조회 실패" },
      { status: 500 }
    );
  }
}
