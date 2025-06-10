import express from "express";
import assignmentController from "../controllers/assignment.controllers.js";

const router = express.Router();

router.get("/", assignmentController.getAll);
router.get("/:id", assignmentController.getById);
router.get("/lesson/:lesson_id", assignmentController.getByLessonId);
router.post("/", assignmentController.create);
router.put("/:id", assignmentController.update);
router.delete("/:id", assignmentController.delete);

export default router;
