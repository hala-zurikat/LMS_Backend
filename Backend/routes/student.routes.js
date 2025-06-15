// routes/studentRoutes.js

import express from "express";
import { authenticate, authorize } from "../middleware/auth.js"; // اللي عندك بالأعلى
import { getStudentDashboardData } from "../controllers/studentController.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate, // يتأكد من الـ token أو session
  authorize("student"), // يتأكد إنه فعلاً الطالب مش مدير أو مدرس
  getStudentDashboardData
);

export default router;
