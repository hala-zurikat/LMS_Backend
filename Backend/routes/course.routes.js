import express from "express";
import { CourseController } from "../controllers/course.controllers.js";

const router = express.Router();

router.get("/", CourseController.getAll);
router.get("/:id", CourseController.getById);
router.post("/", CourseController.create);
router.put("/:id", CourseController.update);
router.delete("/:id", CourseController.delete);

export default router;
