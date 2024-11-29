import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/helper";

dotenv.config(); // Load environment variables

// Custom request interface
export interface CustomRequest extends Request {
  userId?: string;
}

// Verify token middleware
export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt; // Get the token from the cookies
  if (!token) {
    res
      .status(401)
      .json({ status: "failed", message: "Unauthorized - no token provided" });
    return; // Return an error if there is no token
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (!decoded) {
      res
        .status(401)
        .json({ status: "failed", message: "Unauthorized - invalid token" });
      return; // Return an error if there is an invalid token
    }
    (req as CustomRequest).userId = decoded.userId; // Set the user ID in the request
    next(); // Call the next middleware
  } catch (error) {
    next(new CustomError(401, "Unauthorized")); // Return an error if there is an error
  }
};
