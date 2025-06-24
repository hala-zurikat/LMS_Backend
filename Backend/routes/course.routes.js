import express from "express";
import { CourseController } from "../controllers/course.controllers.js";

const router = express.Router();

router.get("/", CourseController.getAll);
router.get("/:id", CourseController.getById); // 🟢 هذا لازم يكون قبل أي :param تاني
router.get("/:id/details", CourseController.getCourseContent);
router.get("/content/:id", CourseController.getCourseContent); // إذا لسه بدك هذا
router.post("/", CourseController.create);
router.put("/:id", CourseController.update);
router.delete("/:id", CourseController.delete);
router.get("/instructor/:instructorId", CourseController.getByInstructorId);
router.get("/user/:userId", CourseController.getByUserId);

export default router;
