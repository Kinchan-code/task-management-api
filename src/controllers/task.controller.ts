import { formatDateToPST } from "./../utils/dateFormatter";
import { Response, NextFunction } from "express";
import CustomError from "../utils/helper";
import { logger } from "../middlewares/logger";
import { CustomRequest } from "../middlewares/verifyToken";
import {
  createTaskService,
  getTasksService,
  updateTaskService,
  getTaskByIdService,
  deleteTaskService,
} from "../services/tasks.service";
import { createTaskValidation } from "../validations/task.validation";
import { z } from "zod";

// Create a task
export const createTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get user id
  const userId = req.userId;

  // Check if user id is valid
  if (!userId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  // Get project id
  const projectId = req.body.projectId;

  // Check if project id is valid
  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  try {
    // Validate the request body
    const validatedTask = createTaskValidation.parse(req.body);

    // Create a task
    const task = await createTaskService(userId, projectId, validatedTask);

    // Payload
    const payload = {
      status: "success",
      message: "Task created successfully",
      data: {
        ...task,
        dueDate: task.dueDate
          ? formatDateToPST(task.dueDate.toISOString())
          : null,
        createdAt: task.createdAt
          ? formatDateToPST(task.createdAt.toISOString())
          : null,
        updatedAt: task.updatedAt
          ? formatDateToPST(task.updatedAt.toISOString())
          : null,
        deletedAt: task.deletedAt
          ? formatDateToPST(task.deletedAt.toISOString())
          : null,
      },
    };

    // Send response
    res.status(201).json(payload);
  } catch (error) {
    // Handle validation error
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error: " + error.message });
      return;
    }
    // Log the error
    logger.error(`Error creating task: ${error}`);
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};

// Get all tasks
export const getTasks = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get user id
  const userId = req.userId;

  // Check if user id is valid
  if (!userId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  // Get project id
  const projectId = req.params.projectId;

  // Check if project id is valid
  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  try {
    // Get the query from the request
    const query = req.query;
    const search = query.search as string | undefined;
    const priority = query.priority as string;
    const status = query.status as string;
    const page = query.page ? Number(query.page) : undefined;
    const limit = query.limit ? Number(query.limit) : undefined;

    // Get all tasks
    const { tasks, totalTasks } = await getTasksService(
      userId,
      projectId,
      search,
      priority,
      status,
      page,
      limit
    );

    const totalPages = limit ? Math.ceil(totalTasks / limit) : undefined;

    // Payload
    const payload = {
      status: "success",
      message: "Tasks fetched successfully",
      data: tasks.map((task) => ({
        ...task,
        dueDate: task.dueDate
          ? formatDateToPST(task.dueDate.toISOString())
          : null,
        createdAt: task.createdAt
          ? formatDateToPST(task.createdAt.toISOString())
          : null,
        updatedAt: task.updatedAt
          ? formatDateToPST(task.updatedAt.toISOString())
          : null,
        deletedAt: task.deletedAt
          ? formatDateToPST(task.deletedAt.toISOString())
          : null,
      })),
      page,
      limit,
      totalPages,
    };

    // Send response
    res.status(200).json(payload);
  } catch (error) {
    // Log the error
    logger.error(`Error getting tasks: ${error}`);
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};

// Get a task by id
export const getTaskById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get user id
  const userId = req.userId;

  // Check if user id is valid
  if (!userId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  // Get project id
  const projectId = req.params.projectId;

  // Check if project id is valid
  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  // Get task id
  const taskId = req.params.taskId;

  // Check if task id is valid
  if (!taskId) {
    return next(new CustomError(400, "Task ID is required"));
  }

  try {
    // Get a task by id
    const task = await getTaskByIdService(userId, projectId, taskId);

    // Payload
    const payload = {
      status: "success",
      message: "Task fetched successfully",
      data: {
        ...task,
        dueDate: task.dueDate
          ? formatDateToPST(task.dueDate.toISOString())
          : null,
        createdAt: task.createdAt
          ? formatDateToPST(task.createdAt.toISOString())
          : null,
        updatedAt: task.updatedAt
          ? formatDateToPST(task.updatedAt.toISOString())
          : null,
        deletedAt: task.deletedAt
          ? formatDateToPST(task.deletedAt.toISOString())
          : null,
      },
    };

    // Send response
    res.status(200).json(payload);
  } catch (error) {
    // Log the error
    logger.error(`Error getting task by id: ${error}`);
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};

// Update a task
export const updateTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get user id
  const userId = req.userId;

  // Check if user id is valid
  if (!userId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  // Get project id
  const projectId = req.body.projectId;

  // Check if project id is valid
  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  // Get task id
  const taskId = req.params.taskId;

  // Check if task id is valid
  if (!taskId) {
    return next(new CustomError(400, "Task ID is required"));
  }

  try {
    // Validate the request body
    const validatedTask = createTaskValidation.parse(req.body);

    // Update a task
    const task = await updateTaskService(
      userId,
      projectId,
      taskId,
      validatedTask
    );

    // Payload
    const payload = {
      status: "success",
      message: "Task updated successfully",
      data: {
        ...task,
        dueDate: task.dueDate
          ? formatDateToPST(task.dueDate.toISOString())
          : null,
        createdAt: task.createdAt
          ? formatDateToPST(task.createdAt.toISOString())
          : null,
        updatedAt: task.updatedAt
          ? formatDateToPST(task.updatedAt.toISOString())
          : null,
        deletedAt: task.deletedAt
          ? formatDateToPST(task.deletedAt.toISOString())
          : null,
      },
    };

    // Send response
    res.status(200).json(payload);
  } catch (error) {
    // Log the error
    logger.error(`Error updating task: ${error}`);
    // Handle validation error
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error: " + error.message });
      return;
    }
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};

// Delete a task
export const deleteTask = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get user id
  const userId = req.userId;

  // Check if user id is valid
  if (!userId) {
    return next(new CustomError(401, "Unauthorized"));
  }

  // Get project id
  const projectId = req.params.projectId;

  // Check if project id is valid
  if (!projectId) {
    return next(new CustomError(400, "Project ID is required"));
  }

  // Get task id
  const taskId = req.params.taskId;

  // Check if task id is valid
  if (!taskId) {
    return next(new CustomError(400, "Task ID is required"));
  }

  try {
    // Delete a task
    const task = await deleteTaskService(userId, projectId, taskId);

    // Payload
    const payload = {
      status: "success",
      message: "Task deleted successfully",
      data: {
        ...task,
        dueDate: task.dueDate
          ? formatDateToPST(task.dueDate.toISOString())
          : null,
        createdAt: task.createdAt
          ? formatDateToPST(task.createdAt.toISOString())
          : null,
        updatedAt: task.updatedAt
          ? formatDateToPST(task.updatedAt.toISOString())
          : null,
        deletedAt: task.deletedAt
          ? formatDateToPST(task.deletedAt.toISOString())
          : null,
      },
    };

    // Send response
    res.status(200).json(payload);
  } catch (error) {
    // Log the error
    logger.error(`Error deleting task: ${error}`);
    // Handle error
    next(new CustomError(500, (error as Error).message));
  }
};
