import express from "express";
import {
  getAllQuizzes,
  getQuizById,
  getQuizzesByLesson,
  addQuiz,
  editQuiz,
  removeQuiz,
} from "../controllers/quiz.controllers.js";

const router = express.Router();

router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.get("/lesson/:lesson_id", getQuizzesByLesson);
router.post("/", addQuiz);
router.put("/:id", editQuiz);
router.delete("/:id", removeQuiz);

export default router;
