import express from "express";
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  createTask,
  getTasks,
  updateTask,
  getTaskById,
  deleteTask,
} from "../controllers/task.controller";

const router: Router = express.Router();

// Create a task
router.post("/create-task", verifyToken, createTask);

// Get all tasks
router.get("/:projectId/tasks", verifyToken, getTasks);

// Get a task by id
router.get("/:projectId/task/:taskId", verifyToken, getTaskById);

// Update a task
router.put("/update-task/:taskId", verifyToken, updateTask);

// Delete a task
router.delete("/:projectId/delete-task/:taskId", verifyToken, deleteTask);

export default router;
