import express from "express";
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectById,
} from "../controllers/project.controller";

const router: Router = express.Router();

// Create a project
router.post("/create-project", verifyToken, createProject);

// Get all projects
router.get("/projects", verifyToken, getProjects);

// Update a project
router.put("/update-project/:id", verifyToken, updateProject);

// Get a project by id
router.get("/project/:id", verifyToken, getProjectById);

// Delete a project
router.delete("/delete-project/:id", verifyToken, deleteProject);

export default router;
