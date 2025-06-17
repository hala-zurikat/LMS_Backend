import express from "express";
import { getAdminStats } from "../controllers/admin.controllers.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", authenticate, authorize("admin"), getAdminStats);

export default router;
