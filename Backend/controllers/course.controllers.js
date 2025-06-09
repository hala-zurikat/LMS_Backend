import * as CourseModel from "../models/course.models.js";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../validations/course.validation.js";

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
  try {
    // ✅ Validation
    const { error } = createCourseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, instructor_id, category_id } = req.body;

    const course = await CourseModel.createCourse({
      title,
      description,
      instructor_id,
      category_id,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Course Controller
export const update = async (req, res) => {
  try {
    // ✅ Validation
    const { error } = updateCourseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const courseId = req.params.id;
    const { title, description, instructor_id, category_id } = req.body;

    const updatedCourse = await CourseModel.updateCourse(courseId, {
      title,
      description,
      instructor_id,
      category_id,
    });

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
