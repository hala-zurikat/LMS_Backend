import {
  deleteLesson,
  getAllLessons,
  updateLesson,
  getLessonById,
  createLesson,
} from "../models/lesson.models.js";

export const fetchAllLessons = async (req, res) => {
  try {
    const lessons = await getAllLessons();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchLesson = async (req, res) => {
  try {
    const lesson = await getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addLesson = async (req, res) => {
  try {
    const newLesson = await createLesson(req.body);
    res.status(201).json(newLesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const editLesson = async (req, res) => {
  try {
    const updated = await updateLesson(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeLesson = async (req, res) => {
  try {
    await deleteLesson(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
