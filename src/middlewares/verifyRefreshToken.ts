import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/helper";
import { logger } from "./logger";
import { UserType } from "../types/user.types";
import prisma from "../prisma/server";

dotenv.config();

export const verifyRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get refresh token from cookies
  const refreshToken = req.cookies.refreshJwt;

  // Return an error if there is no refresh token
  if (!refreshToken || typeof refreshToken !== "string") {
    res
      .status(401)
      .json({ message: "Unauthorized - no refresh token provided" });
    return;
  }
  try {
    // Check if the refresh token is valid in the database
    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!storedToken) {
      res.status(401).json({
        status: "failed",
        message: "Unauthorized - invalid refresh token",
      });
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET as string
    ) as jwt.JwtPayload;

    // Return an error if there is an invalid refresh token
    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Unauthorized - invalid refresh token" });
      return;
    }

    // Invalidate the refresh token
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    // Return the user ID
    (req as unknown as UserType).userId = decoded.userId;
    next();
  } catch (error) {
    // Log the error
    logger.error(`Error verifying refresh token: ${error}`);

    // Return an error if there is an error
    next(new CustomError(500, "Failed to verify refresh token"));
  }
};
