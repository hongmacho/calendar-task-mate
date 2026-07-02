import "server-only";

import { db } from "@/src/db";
import { projects } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export interface CreateProjectInput {
  name: string;
  color?: string;
  billableRate?: number;
}

export interface UpdateProjectInput {
  name?: string;
  color?: string;
  billableRate?: number;
}

export class ProjectRepository {
  async create(input: CreateProjectInput) {
    const result = await db.insert(projects).values(input).returning();
    return result[0];
  }

  async findById(id: number) {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return result[0] || null;
  }

  async findAll() {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async update(id: number, input: UpdateProjectInput) {
    const result = await db
      .update(projects)
      .set(input)
      .where(eq(projects.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: number) {
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }
}

export const projectRepository = new ProjectRepository();
