import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { instructorStatsHandler } from "../controllers/instructor.controllers.js";

const router = express.Router();

router.get(
  "/stats",
  authenticate,
  authorize("instructor"),
  instructorStatsHandler
);

export default router;
