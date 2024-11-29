import express from "express";
import { Router } from "express";
import {
  signUp,
  login,
  logout,
  changePassword,
  checkCookie,
  refreshToken,
  editProfile,
  getProfile,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRefreshToken } from "../middlewares/verifyRefreshToken";

const router: Router = express.Router();

// Signup route
router.post("/signup", signUp);

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", verifyToken, logout);

// Change password route
router.post("/change-password", verifyToken, changePassword);

// Check cookie route
router.get("/check-cookie", verifyToken, checkCookie);

// Refresh token route
router.post("/refresh-token", verifyRefreshToken, refreshToken);

// Get Profile route
router.get("/profile", verifyToken, getProfile);

// Edit Profile route
router.put("/edit-profile", verifyToken, editProfile);

export default router;
