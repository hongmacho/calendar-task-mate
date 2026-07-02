import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").default("blue-500"),
  billableRate: integer("billable_rate"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  projectId: integer("project_id").references(() => projects.id),
  status: text("status", {
    enum: ["unassigned", "assigned", "in_progress", "completed"],
  }).default("unassigned"),
  estimatedHours: integer("estimated_hours").default(1),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .$onUpdateFn(() => new Date()),
});

export const timeBlocks = sqliteTable("time_blocks", {
  id: integer("id").primaryKey(),
  taskId: integer("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});

export const calendarEvents = sqliteTable("calendar_events", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(cast(unixepoch() * 1000 as integer))`)
    .notNull(),
});
