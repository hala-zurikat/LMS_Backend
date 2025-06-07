import * as CourseModel from "../models/course.models.js";
import { courseSchema } from "../validations/course.validation.js";

export const getAll = async (req, res) => {
  try {
    const courses = await CourseModel.getAllCourses();
    res.json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const course = await CourseModel.getCourseById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  const { error } = courseSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const course = await CourseModel.createCourse(req.body);
    res.status(201).json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create course", error: err.message });
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = courseSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updated = await CourseModel.updateCourse(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await CourseModel.deleteCourse(id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
