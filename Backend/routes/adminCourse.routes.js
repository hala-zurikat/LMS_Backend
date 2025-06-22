import express from "express";
import {
  getAllAdminCourses,
  approveCourse,
  getCourseContentAdmin, // تحتاج تنشئها في الكونترولر
} from "../controllers/courseAdmin.controllers.js";

import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));

router.get("/", getAllAdminCourses);
router.get("/:courseId/content", getCourseContentAdmin); // لازم تعرفها في الكونترولر
router.patch("/:courseId/approve", approveCourse);

export default router;
