import {
  deleteLesson,
  getAllLessons,
  updateLesson,
  getLessonById,
  createLesson,
} from "../models/lesson.models.js";
import {
  createLessonSchema,
  updateLessonSchema,
} from "../validations/lesson.validations.js";

export const fetchAllLessons = async (req, res) => {
  try {
    const lessons = await getAllLessons();
    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchLesson = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid lesson ID" });

    const lesson = await getLessonById(id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    res.status(200).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { error } = createLessonSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const newLesson = await createLesson(req.body);
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editLesson = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid lesson ID" });
    const { error } = updateLessonSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updated = await updateLesson(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeLesson = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid lesson ID" });

    const deleted = await deleteLesson(id);
    if (!deleted) return res.status(404).json({ error: "Lesson not found" });

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
