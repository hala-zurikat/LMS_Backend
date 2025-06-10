import QuizModel from "../models/quiz.models.js";
import { validateQuiz } from "../validations/quiz.validation.js";

const quizController = {
  async getAll(req, res) {
    try {
      const quizzes = await QuizModel.getAll();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid quiz id" });

      const quiz = await QuizModel.getById(id);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByLessonId(req, res) {
    try {
      const lesson_id = parseInt(req.params.lesson_id, 10);
      if (isNaN(lesson_id))
        return res.status(400).json({ error: "Invalid lesson id" });

      const quizzes = await QuizModel.getByLessonId(lesson_id);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { error, value } = validateQuiz(req.body);
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const newQuiz = await QuizModel.create(value);
      res.status(201).json(newQuiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid quiz id" });

      const exists = await QuizModel.exists(id);
      if (!exists) return res.status(404).json({ error: "Quiz not found" });

      const { error, value } = validateQuiz(req.body);
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const updatedQuiz = await QuizModel.update(id, value);
      res.json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid quiz id" });

      const deletedQuiz = await QuizModel.delete(id);
      if (!deletedQuiz)
        return res.status(404).json({ error: "Quiz not found" });

      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default quizController;
