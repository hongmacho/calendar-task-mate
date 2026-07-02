import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tasks = [
      { id: 1, title: "프로젝트 A - 기획", status: "unassigned", hours: 2 },
      { id: 2, title: "프로젝트 B - 개발", status: "in_progress", hours: 3 },
    ];
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
    return NextResponse.json(
      { success: true, data: { id: Date.now(), ...body } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 400 }
    );
  }
}
