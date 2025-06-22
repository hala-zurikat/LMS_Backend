import QuizModel from "../models/quiz.models.js";
import { validateQuiz } from "../validations/quiz.validation.js";

const quizController = {
  async getAll(req, res) {
    try {
      const quizzes = await QuizModel.getAll();

      // Parse options to array
      const parsed = quizzes.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      }));

      res.json(parsed);
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

      quiz.options = JSON.parse(quiz.options);

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

      const parsed = quizzes.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      }));

      res.json(parsed);
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

      // Convert options to JSON string for PostgreSQL
      const quizData = {
        ...value,
        options: JSON.stringify(value.options),
      };

      const newQuiz = await QuizModel.create(quizData);
      newQuiz.options = value.options; // return it as array in the response

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

      const updatedQuiz = await QuizModel.update(id, {
        ...value,
        options: JSON.stringify(value.options),
      });

      updatedQuiz.options = value.options;

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
