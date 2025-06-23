import QuizModel from "../models/quiz.models.js";
import { validateQuiz } from "../validations/quiz.validation.js";

const quizController = {
  async getAll(req, res) {
    try {
      const quizzes = await QuizModel.getAll();
      const parsed = quizzes.map((q) => ({
        ...q,
        options: q.options || [],
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

      quiz.options = quiz.options || [];
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
        options: q.options || [],
      }));
      res.json(parsed);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getGroupedByCourseAndModule(req, res) {
    try {
      const result = await QuizModel.getGroupedByCourseAndModule();
      res.json(result);
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

      let optionsArray;
      if (typeof value.options === "string") {
        optionsArray = value.options
          .split(",")
          .map((opt) => opt.trim())
          .filter((opt) => opt.length > 0);
      } else if (Array.isArray(value.options)) {
        optionsArray = value.options;
      } else {
        optionsArray = [];
      }

      const quizData = {
        ...value,
        options: optionsArray,
      };

      const newQuiz = await QuizModel.create(quizData);
      newQuiz.options = optionsArray;

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

      let optionsArray;
      if (typeof value.options === "string") {
        optionsArray = value.options
          .split(",")
          .map((opt) => opt.trim())
          .filter((opt) => opt.length > 0);
      } else if (Array.isArray(value.options)) {
        optionsArray = value.options;
      } else {
        optionsArray = [];
      }

      const updatedQuiz = await QuizModel.update(id, {
        ...value,
        options: optionsArray,
      });

      updatedQuiz.options = optionsArray;
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
