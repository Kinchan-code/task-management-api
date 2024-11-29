import { z } from "zod";
import { createProjectValidation } from "../validations/project.validation";

// Create project type
export type CreateProjectType = z.infer<typeof createProjectValidation>;
