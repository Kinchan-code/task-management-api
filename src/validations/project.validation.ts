import { ProjectPriority, ProjectStatus } from "@prisma/client";
import { z } from "zod";

// Create a project
export const createProjectValidation = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  dueDate: z.date().optional(),
  status: z.nativeEnum(ProjectStatus, {
    message: "Status is required",
  }),
  priority: z.nativeEnum(ProjectPriority, {
    message: "Priority is required",
  }),
});

// Update a project
export const updateProjectValidation = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  dueDate: z.date().optional(),
  status: z.nativeEnum(ProjectStatus, {
    message: "Status is required",
  }),
  priority: z.nativeEnum(ProjectPriority, {
    message: "Priority is required",
  }),
});
