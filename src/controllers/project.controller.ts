import { Response, NextFunction } from "express";
import { z } from "zod";
import CustomError from "../utils/helper";

import { logger } from "../middlewares/logger";
import {
  createProjectService,
  getAllProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} from "../services/project.service";
import { CustomRequest } from "../middlewares/verifyToken";
import { formatDateToPST } from "../utils/dateFormatter";
import {
  createProjectValidation,
  updateProjectValidation,
} from "../validations/project.validation";

// Create a project
export const createProject = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the user id from the User object in the request
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    // Validate the project
    const validatedProject = createProjectValidation.parse(req.body);

    // Create a project
    const project = await createProjectService(validatedProject, userId);

    // Payload
    const payload = {
      status: "success",
      message: "Project created successfully",
      data: {
        ...project,
        dueDate: project.dueDate
          ? formatDateToPST(project.dueDate.toISOString())
          : null,
        createdAt: project.createdAt
          ? formatDateToPST(project.createdAt.toISOString())
          : null,
        updatedAt: project.updatedAt
          ? formatDateToPST(project.updatedAt.toISOString())
          : null,
        deletedAt: project.deletedAt
          ? formatDateToPST(project.deletedAt.toISOString())
          : undefined,
      },
    };

    // Return the project
    res.status(201).json(payload);
  } catch (error) {
    // Handle validation error
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error: " + error.message });
      return;
    }
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};

// Get all projects
export const getProjects = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the user id from the User object in the request
  const userId = req.userId;

  // Check if the user id is valid
  if (!userId) {
    res
      .status(401)
      .json({ status: "failed", message: "Unauthorized - no user found" });
    return;
  }
  try {
    // Get the query from the request
    const query = req.query;
    const search = query.search as string | undefined;
    const priority = query.priority as string;
    const status = query.status as string;
    const page = query.page ? Number(query.page) : undefined;
    const limit = query.limit ? Number(query.limit) : undefined;

    // Get all projects
    const { projects, totalProjects } = await getAllProjectsService(
      userId,
      search,
      priority,
      status,
      page,
      limit
    );

    const totalPages = limit ? Math.ceil(totalProjects / limit) : undefined;

    // Payload
    const payload = {
      status: "success",
      message: "Projects fetched successfully",
      total: totalProjects,
      data: projects.map((project) => ({
        ...project,
        dueDate: project.dueDate
          ? formatDateToPST(project.dueDate.toISOString())
          : null,
        createdAt: project.createdAt
          ? formatDateToPST(project.createdAt.toISOString())
          : null,
        updatedAt: project.updatedAt
          ? formatDateToPST(project.updatedAt.toISOString())
          : null,
        deletedAt: project.deletedAt
          ? formatDateToPST(project.deletedAt.toISOString())
          : undefined,
      })),
      page: page,
      limit: limit,
      totalPages: totalPages,
    };

    // Return the projects
    res.status(200).json(payload);
  } catch (error) {
    // Log the error
    logger.error(`Error fetching projects: ${error}`);
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};

// Get a project by id
export const getProjectById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the user id from the User object in the request
  const userId = req.userId;

  // Check if the user id is valid
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Get the project id from the request
  const projectId = req.params.id;

  // Check if the project id is valid
  if (!projectId) {
    res.status(400).json({ message: "Project id is required" });
    return;
  }

  try {
    // Get the project by id
    const project = await getProjectByIdService(projectId, userId);

    // Payload
    const payload = {
      status: "success",
      message: "Project fetched successfully",
      data: {
        ...project,
        dueDate: project.dueDate
          ? formatDateToPST(project.dueDate.toISOString())
          : null,
        createdAt: project.createdAt
          ? formatDateToPST(project.createdAt.toISOString())
          : null,
        updatedAt: project.updatedAt
          ? formatDateToPST(project.updatedAt.toISOString())
          : null,
        deletedAt: project.deletedAt
          ? formatDateToPST(project.deletedAt.toISOString())
          : undefined,
      },
    };

    // Return the project
    res.status(200).json(payload);
  } catch (error) {
    // Log the error
    logger.error(`Error getting project by id: ${error}`);
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};

// Update a project
export const updateProject = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the user id from the User object in the request
  const userId = req.userId;

  // Check if the user id is valid
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Get the project id from the request
  const projectId = req.params.id;

  // Check if the project id is valid
  if (!projectId) {
    res.status(400).json({ message: "Project id is required" });
    return;
  }

  try {
    // Validate the project
    const validatedProject = updateProjectValidation.parse(req.body);

    // Update a project
    const project = await updateProjectService(
      projectId,
      validatedProject,
      userId
    );

    // Payload
    const payload = {
      status: "success",
      message: "Project updated successfully",
      data: {
        ...project,
        dueDate: project.dueDate
          ? formatDateToPST(project.dueDate.toISOString())
          : null,
        createdAt: project.createdAt
          ? formatDateToPST(project.createdAt.toISOString())
          : null,
        updatedAt: project.updatedAt
          ? formatDateToPST(project.updatedAt.toISOString())
          : null,
        deletedAt: project.deletedAt
          ? formatDateToPST(project.deletedAt.toISOString())
          : undefined,
      },
    };

    // Return the project
    res.status(200).json(payload);
  } catch (error) {
    // Log the error
    logger.error(`Error updating project: ${error}`);
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};

// Delete a project
export const deleteProject = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the user id from the User object in the request
  const userId = req.userId;

  // Check if the user id is valid
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Get the project id from the request
  const projectId = req.params.id;

  // Check if the project id is valid
  if (!projectId) {
    res.status(400).json({ message: "Project id is required" });
    return;
  }
  try {
    // Delete a project
    const project = await deleteProjectService(projectId, userId);

    // Payload
    const payload = {
      status: "success",
      message: "Project deleted successfully",
      data: {
        ...project,
        dueDate: project.dueDate
          ? formatDateToPST(project.dueDate.toISOString())
          : null,
        createdAt: project.createdAt
          ? formatDateToPST(project.createdAt.toISOString())
          : null,
        updatedAt: project.updatedAt
          ? formatDateToPST(project.updatedAt.toISOString())
          : null,
        deletedAt: project.deletedAt
          ? formatDateToPST(project.deletedAt.toISOString())
          : undefined,
      },
    };

    // Return the payload
    res.status(200).json(payload);
  } catch (error) {
    // Log the error
    logger.error(`Error deleting project: ${error}`);
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};
