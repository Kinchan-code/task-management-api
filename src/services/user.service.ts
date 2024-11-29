import argon2 from "argon2";
import prisma from "../prisma/server";
import CustomError from "../utils/helper";
import {
  ChangePasswordType,
  EditProfileType,
  LoginType,
  SignUpType,
} from "../types/user.types";
import { logger } from "../middlewares/logger";
import jwt from "jsonwebtoken";

// Signup service
export const signUpService = async (data: SignUpType) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // If user already exists, throw an error
    if (existingUser) {
      throw new CustomError(400, "User already exists");
    }

    // Hash password
    const hashedPassword = await argon2.hash(data.password);

    // Create user
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    // Log the user creation
    logger.info(`User created successfully: ${user.id}`);

    // Return the user
    return user;
  } catch (error) {
    // Log the error
    logger.error(`Error creating user: ${error}`, {
      stack: (error as Error).stack,
    });

    // Handle the error
    throw error;
  }
};

// Login service
export const loginService = async (data: LoginType) => {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Check if user exists
    if (!user) {
      throw new CustomError(401, "Invalid email or password");
    }

    // Check if password is correct
    const isPasswordCorrect = await argon2.verify(user.password, data.password);
    if (!isPasswordCorrect) {
      throw new CustomError(401, "Invalid email or password");
    }

    // Return the user
    return user;
  } catch (error) {
    // Log the error
    logger.error(`Error logging in user: ${error}`);

    // Handle the error
    throw error;
  }
};

// Change password service
export const changePasswordService = async (
  data: ChangePasswordType,
  userId: string
) => {
  try {
    // Find user by id
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Check if user exists
    if (!user) {
      throw new CustomError(401, "User not found");
    }

    // Check if current password is correct
    const isPasswordCorrect = await argon2.verify(
      user.password,
      data.currentPassword
    );
    if (!isPasswordCorrect) {
      throw new CustomError(401, "Invalid current password");
    }

    // Hash new password
    const hashedPassword = await argon2.hash(data.newPassword);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Return the updated user
    return updatedUser;
  } catch (error) {
    // Log the error
    logger.error(`Error changing password: ${error}`);

    // Handle the error
    throw error;
  }
};

// Verify session token service
export const verifySessionToken = (token: string): { userId: string } => {
  try {
    // Check if token is present
    if (!token) {
      throw new CustomError(401, "Unauthorized - no session cookie found");
    }

    // Verify the token
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as jwt.JwtPayload;
      if (!decoded || !decoded.userId) {
        throw new CustomError(401, "Unauthorized - invalid session cookie");
      }
      return { userId: decoded.userId };
    } catch (error) {
      throw new CustomError(401, "Unauthorized - invalid session cookie");
    }
  } catch (error) {
    // Log the error
    logger.error(`Error verifying session token: ${error}`);

    // Handle the error
    throw error;
  }
};

// Get profile service
export const getProfileService = async (userId: string) => {
  try {
    // Find user by id
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Check if user exists
    if (!user) {
      throw new CustomError(404, "User not found");
    }

    // Return the user
    return user;
  } catch (error) {
    // Log the error
    logger.error(`Error getting profile: ${error}`);

    // Handle the error
    throw error;
  }
};

// Edit profile service
export const editProfileService = async (
  data: EditProfileType,
  userId: string
) => {
  try {
    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    // Return the updated user
    return user;
  } catch (error) {
    // Log the error
    logger.error(`Error editing profile: ${error}`);

    // Handle the error
    throw error;
  }
};
