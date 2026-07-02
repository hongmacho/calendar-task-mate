import "server-only";

import { db } from "@/src/db";
import { tasks } from "@/src/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId?: number;
  estimatedHours?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: "unassigned" | "assigned" | "in_progress" | "completed";
  estimatedHours?: number;
}

export class TaskRepository {
  async create(input: CreateTaskInput) {
    const result = await db.insert(tasks).values(input).returning();
    return result[0];
  }

  async findById(id: number) {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0] || null;
  }

  async findAll() {
    return await db.select().from(tasks).orderBy(desc(tasks.createdAt));
  }

  async findByStatus(status: string) {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.status, status))
      .orderBy(desc(tasks.createdAt));
  }

  async update(id: number, input: UpdateTaskInput) {
    const result = await db
      .update(tasks)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number) {
    await db.delete(tasks).where(eq(tasks.id, id));
    return true;
  }

  async getStats() {
    const result = await db
      .select({
        total: sql<number>`COUNT(*)`,
        unassigned: sql<number>`COUNT(CASE WHEN ${tasks.status} = 'unassigned' THEN 1 END)`,
        inProgress: sql<number>`COUNT(CASE WHEN ${tasks.status} = 'in_progress' THEN 1 END)`,
        completed: sql<number>`COUNT(CASE WHEN ${tasks.status} = 'completed' THEN 1 END)`,
        totalHours: sql<number>`SUM(CAST(${tasks.estimatedHours} AS INTEGER))`,
      })
      .from(tasks);
    return result[0];
  }
}

export const taskRepository = new TaskRepository();
