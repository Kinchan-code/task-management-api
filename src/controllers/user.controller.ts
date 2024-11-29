import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import CustomError from "../utils/helper";
import { generateTokenAndSetCookie } from "../utils/generateToken";
import {
  changePasswordSchema,
  editProfileSchema,
  loginSchema,
  signUpSchema,
} from "../validations/user.validation";
import {
  loginService,
  signUpService,
  changePasswordService,
  verifySessionToken,
  editProfileService,
  getProfileService,
} from "../services/user.service";
import { logger } from "../middlewares/logger";
import { formatDateToPST } from "../utils/dateFormatter";
import { CustomRequest } from "../middlewares/verifyToken";

// Signup controller
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate data
    const validatedData = signUpSchema.parse({ name, email, password });

    // Call the signup service
    const user = await signUpService(validatedData);

    // Log the user creation
    logger.info(`User created successfully: ${user.id}`);

    // Remove password from response
    const data = {
      ...user,
      password: undefined,
      createdAt: user.createdAt
        ? formatDateToPST(user.createdAt.toISOString())
        : null,
      updatedAt: user.updatedAt
        ? formatDateToPST(user.updatedAt.toISOString())
        : null,
    };

    // Send response
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data,
    });
  } catch (error) {
    // Log the error
    logger.error(`Error creating user: ${error}`);

    // Handle validation error
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error: " + error.message });
      return;
    }

    // Handle other errors
    next(new CustomError(500, (error as Error).message));
  }
};

// Login controller
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate data
    const validatedData = loginSchema.parse({ email, password });

    // Call the login service
    const user = await loginService(validatedData);
    // Generate token and set cookie
    await generateTokenAndSetCookie(res, user.id);

    // Remove password from response
    const data = {
      ...user,
      password: undefined,
      createdAt: formatDateToPST(user.createdAt.toISOString()),
      updatedAt: formatDateToPST(user.updatedAt.toISOString()),
    };

    // Send response
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: data,
    });
  } catch (error) {
    // Log the error
    logger.error(`Error logging in user: ${error}`);

    // Handle validation error
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error: " + error.message });
      return;
    }

    // Handle other errors
    next(new CustomError(500, (error as Error).message));
  }
};

// Logout controller
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Clear cookie
    res.clearCookie("jwt");
    res.clearCookie("refreshJwt");
    // Send response
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    // Log the error
    logger.error(`Error logging out user: ${error}`);

    // Handle other errors
    next(new CustomError(500, (error as Error).message));
  }
};

// Change password controller
export const changePassword = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Verify the user id
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const { currentPassword, newPassword } = req.body;

    // Validate data
    const validatedData = changePasswordSchema.parse({
      currentPassword,
      newPassword,
    });

    // Call the change password service
    const user = await changePasswordService(validatedData, userId);

    // Remove password from response
    const data = {
      ...user,
      password: undefined,
      createdAt: user.createdAt
        ? formatDateToPST(user.createdAt.toISOString())
        : null,
      updatedAt: user.updatedAt
        ? formatDateToPST(user.updatedAt.toISOString())
        : null,
    };

    // Send response
    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
      data,
    });
  } catch (error) {
    // Log the error
    logger.error(`Error changing password: ${error}`);

    // Handle other errors
    next(new CustomError(500, (error as Error).message));
  }
};

// Check cookie controller
export const checkCookie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the token from the cookies
    const token = req.cookies.jwt;

    // Verify the session token
    const { userId } = verifySessionToken(token);

    // Send response
    res.status(200).json({
      status: "success",
      message: "Session cookie is valid",
      userId,
    });
  } catch (error) {
    // Log the error
    logger.error(`Error checking session cookie: ${error}`);

    // Handle other errors
    next(new CustomError(500, (error as Error).message));
  }
};

// Refresh token controller
export const refreshToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Verify refresh token
  const userId = req.userId;

  // Check if the user id is valid
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Generate new access token
    const newAccessToken = await generateTokenAndSetCookie(res, userId);

    // Send response
    res.json({ status: "success", accessToken: newAccessToken });
  } catch (error) {
    // Log the error
    logger.error(`Error refreshing token: ${error}`);

    // Handle other errors
    next(new CustomError(500, (error as Error).message));
  }
};

// Get profile controller
export const getProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Verify the user id
  const userId = req.userId;

  // Check if the user id is valid
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Call the get profile service
    const user = await getProfileService(userId);

    // Remove password from response
    const payload = {
      ...user,
      password: undefined,
      createdAt: user.createdAt
        ? formatDateToPST(user.createdAt.toISOString())
        : null,
      updatedAt: user.updatedAt
        ? formatDateToPST(user.updatedAt.toISOString())
        : null,
    };

    // Send response
    res.status(200).json({
      status: "success",
      message: "Profile fetched successfully",
      data: payload,
    });
  } catch (error) {
    // Log the error
    logger.error(`Error getting profile: ${error}`);

    // Handle other errors
    next(new CustomError(500, (error as Error).message));
  }
};

// Edit profile controller
export const editProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const { name, email } = req.body;

    // Validate data
    const validatedData = editProfileSchema.parse({ name, email });

    // Call the edit profile service
    const user = await editProfileService(validatedData, userId);

    // Remove password from response
    const payload = {
      ...user,
      password: undefined,
      createdAt: user.createdAt
        ? formatDateToPST(user.createdAt.toISOString())
        : null,
      updatedAt: user.updatedAt
        ? formatDateToPST(user.updatedAt.toISOString())
        : null,
    };

    // Send response
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: payload,
    });
  } catch (error) {
    // Log the error
    logger.error(`Error editing profile: ${error}`);

    // Handle validation error
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Validation error: " + error.message });
      return;
    }

    // Handle other errors
    next(new CustomError(500, (error as Error).message));
  }
};
