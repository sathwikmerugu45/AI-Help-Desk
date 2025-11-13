import express from "express";
import {
  getUsers,
  login,
  signup,
  updateUser,
  logout,
} from "../controllers/user.js";

// ✅ Remove authenticate import
const router = express.Router();

// ✅ Remove authenticate middleware
router.post("/update-user", updateUser);
router.get("/users", getUsers); // ✅ No authentication
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;