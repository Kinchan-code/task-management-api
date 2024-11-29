import prisma from "../prisma/server";
import { CreateTaskType } from "../types/task.type";
import { logger } from "../middlewares/logger";
import CustomError from "../utils/helper";
import { createTaskValidation } from "../validations/task.validation";
import { Prisma, TaskPriority, TaskStatus } from "@prisma/client";

// Create a task
export const createTaskService = async (
  userId: string,
  projectId: string,
  data: CreateTaskType
) => {
  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // Check if project exists
    if (!project) {
      throw new CustomError(404, "Project not found");
    }

    // Optional: Check if the user is the author of the project
    if (project.authorId !== userId) {
      throw new CustomError(403, "Unauthorized");
    }

    // Validate the data
    const validatedData = createTaskValidation.parse({
      name: data.name,
      description: data.description,
      dueDate: data.dueDate ?? new Date(),
      status: data.status,
      priority: data.priority,
    });

    // Create a task
    const task = await prisma.task.create({
      data: {
        ...validatedData,
        project: {
          connect: { id: projectId },
        },
      },
    });

    // Check if task is created
    if (!task) {
      throw new CustomError(400, "Failed to create task");
    }

    // Return the task
    return task;
  } catch (error) {
    // Log the error
    logger.error(`Error creating task: ${error}`);
    // Throw an error
    throw new CustomError(500, (error as Error).message);
  }
};

// Get all tasks
export const getTasksService = async (
  userId: string,
  projectId: string,
  search?: string,
  priority?: string,
  status?: string,
  page?: number,
  limit?: number
) => {
  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // Check if project exists
    if (!project) {
      throw new CustomError(404, "Project not found");
    }

    // Optional: Check if the user is the author of the project
    if (project.authorId !== userId) {
      throw new CustomError(403, "Unauthorized");
    }

    // Create a search condition
    const searchCondition =
      typeof search === "string"
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              {
                description: { contains: search, mode: "insensitive" },
              },
            ],
          }
        : {};

    // Create a priority condition
    const priorityCondition =
      typeof priority === "string"
        ? { priority: { equals: priority as TaskPriority } }
        : {};

    // Create a status condition
    const statusCondition =
      typeof status === "string"
        ? { status: { equals: status as TaskStatus } }
        : {};

    // Total number of tasks
    const totalTasks = await prisma.task.count({
      where: {
        projectId,
        ...(searchCondition as Prisma.TaskWhereInput),
        ...(priorityCondition as Prisma.TaskWhereInput),
        ...(statusCondition as Prisma.TaskWhereInput),
      },
    });

    // Get all tasks
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        ...(searchCondition as Prisma.TaskWhereInput),
        ...(priorityCondition as Prisma.TaskWhereInput),
        ...(statusCondition as Prisma.TaskWhereInput),
      },
      take: limit,
      skip: page ? (page - 1) * limit! : undefined,
    });

    // Check if tasks are found
    if (!tasks) {
      throw new CustomError(404, "Tasks not found");
    }

    // Return the tasks
    return { tasks, totalTasks };
  } catch (error) {
    // Log the error
    logger.error(`Error getting tasks: ${error}`);
    // Throw an error
    throw new CustomError(500, (error as Error).message);
  }
};

// Update a task
export const updateTaskService = async (
  userId: string,
  projectId: string,
  taskId: string,
  data: CreateTaskType
) => {
  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // Check if project exists
    if (!project) {
      throw new CustomError(404, "Project not found");
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    // Check if task exists
    if (!task) {
      throw new CustomError(404, "Task not found");
    }

    // Optional: Check if the user is the author of the project
    if (project.authorId !== userId) {
      throw new CustomError(403, "Unauthorized");
    }

    // Validate the data
    const validatedData = createTaskValidation.parse({
      name: data.name,
      description: data.description,
      dueDate: data.dueDate ?? new Date(),
      status: data.status,
      priority: data.priority,
    });

    // Update a task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: validatedData,
    });

    // Check if task is updated
    if (!updatedTask) {
      throw new CustomError(400, "Failed to update task");
    }

    // Return the updated task
    return updatedTask;
  } catch (error) {
    // Log the error
    logger.error(`Error updating task: ${error}`);
    // Throw an error
    throw new CustomError(500, (error as Error).message);
  }
};

// Get a task by id
export const getTaskByIdService = async (
  userId: string,
  projectId: string,
  taskId: string
) => {
  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // Check if project exists
    if (!project) {
      throw new CustomError(404, "Project not found");
    }

    // Optional: Check if the user is the author of the project
    if (project.authorId !== userId) {
      throw new CustomError(403, "Unauthorized");
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    // Check if task exists
    if (!task) {
      throw new CustomError(404, "Task not found");
    }

    // Return the task
    return task;
  } catch (error) {
    // Log the error
    logger.error(`Error getting task by id: ${error}`);
    // Throw an error
    throw new CustomError(500, (error as Error).message);
  }
};

// Delete a task
export const deleteTaskService = async (
  userId: string,
  projectId: string,
  taskId: string
) => {
  try {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // Check if project exists
    if (!project) {
      throw new CustomError(404, "Project not found");
    }

    // Optional: Check if the user is the author of the project
    if (project.authorId !== userId) {
      throw new CustomError(403, "Unauthorized");
    }

    // Delete a task
    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    // Check if task is deleted
    if (!deletedTask) {
      throw new CustomError(400, "Failed to delete task");
    }

    // Return the deleted task
    return deletedTask;
  } catch (error) {
    // Log the error
    logger.error(`Error deleting task: ${error}`);
    // Throw an error
    throw new CustomError(500, (error as Error).message);
  }
};
