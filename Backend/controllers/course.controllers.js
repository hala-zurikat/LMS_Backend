import { CourseModel } from "../models/course.models.js";
import { courseSchema } from "../validations/course.validation.js";

export const CourseController = {
  async getAll(req, res) {
    try {
      const courses = await CourseModel.getAllCourses();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const course = await CourseModel.getCourseById(id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    const { error } = courseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const course = await CourseModel.createCourse(req.body);
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const { error } = courseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const course = await CourseModel.updateCourse(id, req.body);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    try {
      const course = await CourseModel.deleteCourse(id);
      if (!course) return res.status(404).json({ error: "Course not found" });
      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
