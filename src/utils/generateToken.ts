import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { logger } from "../middlewares/logger";
import CustomError from "./helper";
import { generateRefreshToken } from "./generateRefreshToken";

dotenv.config(); // Load environment variables

// Generate token and set cookie
export const generateTokenAndSetCookie = async (
  res: Response,
  userId: string
): Promise<string> => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    // Check if JWT_SECRET is defined
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    // Generate token
    const token = jwt.sign({ userId }, jwtSecret, {
      expiresIn: "7d", // Token expires in 7 days
    });

    // Set cookie
    res.cookie("jwt", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send the cookie over HTTPS in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Generate refresh token
    const refreshToken = await generateRefreshToken(userId);

    // Set refresh token cookie
    res.cookie("refreshJwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Return token
    return token;
  } catch (error) {
    // Log the error
    logger.error(`Error generating token: ${error}`, {
      stack: (error as Error).stack,
    });
    if (!res.headersSent) {
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }

    // Handle the error
    throw new CustomError(500, (error as Error).message);
  }
};
