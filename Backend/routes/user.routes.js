import { Router } from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controllers.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { updateUserRole } from "../controllers/user.controllers.js";

const router = Router();
// Get all users (admin only)
router.get("/", authenticate, authorize("admin"), getUsers);
// Get user by ID (admin, or user themselves)
router.get("/:id", authenticate, getUser);
// Update user (admin can update any user, users can update themselves)
router.put("/:id", authenticate, updateUser);
router.patch("/:id/role", authenticate, authorize("admin"), updateUserRole);

// Delete user (admin only, soft delete)
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

export default router;
