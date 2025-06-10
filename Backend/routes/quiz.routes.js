import express from "express";
import quizController from "../controllers/quiz.controllers.js";

const router = express.Router();

router.get("/", quizController.getAll);
router.get("/:id", quizController.getById);
router.get("/lesson/:lesson_id", quizController.getByLessonId);
router.post("/", quizController.create);
router.put("/:id", quizController.update);
router.delete("/:id", quizController.delete);

export default router;
