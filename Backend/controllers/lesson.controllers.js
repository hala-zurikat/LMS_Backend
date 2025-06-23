import LessonModel from "../models/lesson.models.js";
import { lessonSchema } from "../validations/lesson.validation.js";
import QuizModel from "../models/quiz.models.js";

const lessonController = {
  async getAll(req, res) {
    try {
      const lessons = await LessonModel.getAll();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lesson id" });
      }

      const lesson = await LessonModel.getById(id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      if (lesson.content_type === "quiz") {
        const questions = await QuizModel.getByLessonId(id);
        const lessonWithQuestions = {
          ...lesson,
          questions: questions.map((q) => {
            let optionsParsed = [];
            try {
              optionsParsed = JSON.parse(q.options || "[]");
            } catch (err) {
              console.warn(
                `⚠️ Invalid JSON in options for quiz id ${q.id}, returning empty array`
              );
              optionsParsed = [];
            }
            return {
              ...q,
              options: optionsParsed,
            };
          }),
        };
        return res.json(lessonWithQuestions);
      }

      return res.json(lesson);
    } catch (error) {
      console.error("❌ Error in getById:", error);
      res.status(500).json({ error: error.message });
    }
  },

  async getByModuleId(req, res) {
    try {
      const module_id = parseInt(req.params.module_id, 10);
      if (isNaN(module_id)) {
        return res.status(400).json({ error: "Invalid module id" });
      }

      const lessons = await LessonModel.getByModuleId(module_id);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { error, value } = lessonSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const newLesson = await LessonModel.create(value);
      res.status(201).json(newLesson);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lesson id" });
      }

      const exists = await LessonModel.exists(id);
      if (!exists) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      const { error, value } = lessonSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const updatedLesson = await LessonModel.update(id, value);
      res.json(updatedLesson);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid lesson id" });
      }

      const deletedLesson = await LessonModel.delete(id);
      if (!deletedLesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }

      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default lessonController;
