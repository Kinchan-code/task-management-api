import z from "zod";
import {
  changePasswordSchema,
  editProfileSchema,
  loginSchema,
  signUpSchema,
} from "../validations/user.validation";
import { Request } from "express";
// Signup type
export type SignUpType = z.infer<typeof signUpSchema>;
// Login type
export type LoginType = z.infer<typeof loginSchema>;
// Change password type
export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

// Edit profile type
export type EditProfileType = z.infer<typeof editProfileSchema>;

// User type
export interface UserType extends Request {
  userId: string;
}
