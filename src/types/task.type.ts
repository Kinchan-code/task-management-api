import { z } from "zod";
import { createTaskValidation } from "../validations/task.validation";

// Create a task type
export type CreateTaskType = z.infer<typeof createTaskValidation>;
