import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CustomError from "./helper";
import { logger } from "../middlewares/logger";
import prisma from "../prisma/server";

dotenv.config();

export const generateRefreshToken = async (userId: string): Promise<string> => {
  try {
    const refreshTokenSecret = process.env.REFRESH_JWT_SECRET;
    if (!refreshTokenSecret) {
      throw new Error(
        "REFRESH_JWT_SECRET is not defined in environment variables"
      );
    }
    const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
      expiresIn: "30d",
    });

    if (!refreshToken) {
      throw new Error("Failed to generate refresh token");
    }

    // Save the refresh token to the database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    return refreshToken;
  } catch (error) {
    // Log the error
    logger.error(`Error generating refresh token: ${error}`);

    // Handle the error
    throw new CustomError(500, "Failed to generate refresh token");
  }
};
