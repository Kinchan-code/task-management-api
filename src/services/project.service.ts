import prisma from "../prisma/server";
import { createProjectValidation } from "../validations/project.validation";
import { logger } from "../middlewares/logger";
import CustomError from "../utils/helper";
import { Prisma, ProjectPriority, ProjectStatus } from "@prisma/client";
import { CreateProjectType } from "../types/project.type";

// Create a project
export const createProjectService = async (
  data: CreateProjectType,
  userId: string
) => {
  try {
    // Validate the data
    const validatedData = createProjectValidation.parse({
      name: data.name,
      description: data.description,
      dueDate: data.dueDate ?? new Date(),
      status: data.status,
      priority: data.priority,
    });

    // Create a project
    const project = await prisma.project.create({
      data: { ...validatedData, authorId: userId, progress: 0 },
    });

    // Log the project creation
    logger.info(`Project created successfully: ${project.id}`);

    // Return the project
    return project;
  } catch (error) {
    // Log the error
    logger.error(`Error creating project: ${error}`);
    // Throw an error
    throw new CustomError(500, "Internal server error");
  }
};

// Get all projects
export const getAllProjectsService = async (
  userId: string,
  search?: string,
  priority?: string,
  status?: string,
  page?: number,
  limit?: number
) => {
  try {
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
        ? { priority: { equals: priority as ProjectPriority } }
        : {};

    // Create a status condition
    const statusCondition =
      typeof status === "string"
        ? { status: { equals: status as ProjectStatus } }
        : {};

    // Total number of projects
    const totalProjects = await prisma.project.count({
      where: {
        authorId: userId,
        ...(searchCondition as Prisma.ProjectWhereInput),
        ...(priorityCondition as Prisma.ProjectWhereInput),
        ...(statusCondition as Prisma.ProjectWhereInput),
      },
    });

    // Get all projects
    const projects = await prisma.project.findMany({
      where: {
        authorId: userId,
        ...(searchCondition as Prisma.ProjectWhereInput),
        ...(priorityCondition as Prisma.ProjectWhereInput),
        ...(statusCondition as Prisma.ProjectWhereInput),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: limit,
      skip: page ? (page - 1) * limit! : undefined,
    });

    // Check if the projects exist
    if (!projects) {
      throw new CustomError(404, "Projects not found");
    }

    // Return the projects
    return { projects, totalProjects };
  } catch (error) {
    // Log the error
    logger.error(`Error getting all projects: ${error}`);
    // Throw an error
    throw new CustomError(500, "Internal server error");
  }
};

// Get a project by id
export const getProjectByIdService = async (
  projectId: string,
  userId: string
) => {
  try {
    // Get the project
    const project = await prisma.project.findUnique({
      where: { id: projectId, authorId: userId },
    });

    // Check if the project exists
    if (!project) {
      throw new CustomError(404, "Project not found");
    }

    // Return the project
    return project;
  } catch (error) {
    // Log the error
    logger.error(`Error getting project by id: ${error}`);
    // Throw an error
    throw new CustomError(500, "Internal server error");
  }
};

// Update a project
export const updateProjectService = async (
  projectId: string,
  data: CreateProjectType,
  userId: string
) => {
  try {
    // Update a project
    const project = await prisma.project.update({
      where: { id: projectId, authorId: userId },
      data,
    });

    // Check if the project exists
    if (!project) {
      throw new CustomError(404, "Project not found");
    }

    // Return the project
    return project;
  } catch (error) {
    // Log the error
    logger.error(`Error updating project: ${error}`);
    // Throw an error
    throw new CustomError(500, "Internal server error");
  }
};

// Delete a project
export const deleteProjectService = async (
  projectId: string,
  userId: string
) => {
  try {
    // Delete a Project
    const project = await prisma.project.delete({
      where: { id: projectId, authorId: userId },
    });

    // Check if the project exists
    if (!project) {
      throw new CustomError(404, "Project not found");
    }

    // Return the project
    return project;
  } catch (error) {
    // Log the error
    logger.error(`Error deleting project: ${error}`);
    // Throw an error
    throw new CustomError(500, "Internal server error");
  }
};
