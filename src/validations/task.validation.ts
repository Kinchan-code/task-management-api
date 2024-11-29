import { z } from "zod";
import { TaskPriority, TaskStatus } from "@prisma/client";

// Create a task validation
export const createTaskValidation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  dueDate: z.date().optional(),
  priority: z.nativeEnum(TaskPriority, { message: "Priority is required" }),
  status: z.nativeEnum(TaskStatus, { message: "Status is required" }),
});
