// 📁 routes/instructor.routes.js
import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  instructorStatsHandler,
  createCourseHandler,
  getInstructorCoursesHandler,
  updateCourseHandler,
  deleteCourseHandler,
} from "../controllers/instructor.controllers.js";
import { CourseModel } from "../models/course.models.js";

const router = express.Router();

// عرض تفاصيل كورس واحد
router.get(
  "/courses/:id",
  authenticate,
  authorize("instructor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const instructorId = req.user.id;
      const course = await CourseModel.getById(id);

      if (!course || course.instructor_id !== instructorId) {
        return res
          .status(404)
          .json({ message: "Course not found or access denied" });
      }

      res.json(course);
    } catch (err) {
      console.error("Error fetching course:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// الإحصائيات
router.get(
  "/stats",
  authenticate,
  authorize("instructor"),
  instructorStatsHandler
);

// إضافة كورس
router.post(
  "/courses",
  authenticate,
  authorize("instructor"),
  createCourseHandler
);

// عرض كل كورسات المعلم
router.get(
  "/courses",
  authenticate,
  authorize("instructor"),
  getInstructorCoursesHandler
);

// تعديل كورس
router.put(
  "/courses/:id",
  authenticate,
  authorize("instructor"),
  updateCourseHandler
);

// حذف كورس
router.delete(
  "/courses/:id",
  authenticate,
  authorize("instructor"),
  deleteCourseHandler
);

export default router;
