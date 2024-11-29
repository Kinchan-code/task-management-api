import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/helper";
import { logger } from "./logger";
// Error handler type
type ErrorHandlerType = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Error handler
export const errorHandler: ErrorHandlerType = (err, req, res, next) => {
  // Check if the error is an instance of CustomError
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false, // Return a failure status
      message: err.message, // Return the error message
    });
  }

  // Log unexpected errors
  logger.error(err);

  // In development, include the stack trace for debugging purposes
  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      success: false, // Return a failure status
      message: "Internal Server Error", // Return a generic error message
      stack: err.stack, // Provide stack trace in development for easier debugging
    });
  }

  // For production or other environments, hide the stack trace to avoid exposing sensitive info
  return res.status(500).json({
    success: false, // Return a failure status
    message: "Internal Server Error", // Return a generic error message
  });
};
