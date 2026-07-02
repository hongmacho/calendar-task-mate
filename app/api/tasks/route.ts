import { taskRepository } from "@/src/repositories/task.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const tasks = status
      ? await taskRepository.findByStatus(
          status as "unassigned" | "assigned" | "in_progress" | "completed"
        )
      : await taskRepository.findAll();

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "제목은 필수입니다" },
        { status: 400 }
      );
    }

    const task = await taskRepository.create(body);
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "작업 생성 실패" },
      { status: 400 }
    );
  }
}
