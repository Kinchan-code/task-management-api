import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/user.routes";
import CustomError from "./utils/helper";
import projectsRoutes from "./routes/projects.routes";
import tasksRoutes from "./routes/tasks.routes";

dotenv.config();

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.API_URL,
    credentials: true,
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Cookie Parser
const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error("COOKIE_SECRET is not defined in environment variables");
}
app.use(cookieParser(cookieSecret));

// Body Parser
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/project", projectsRoutes);
app.use("/api/v1/task", tasksRoutes);

// Home Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Task Management API");
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    // Handle custom errors
    res.status(err.statusCode).send({ error: err.message });
  } else {
    // Handle generic errors
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
