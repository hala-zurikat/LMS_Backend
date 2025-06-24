import { CourseModel } from "../models/course.models.js";
import { courseSchema } from "../validations/course.validation.js";

export const CourseController = {
  async getAll(req, res) {
    try {
      const { category_id } = req.query;

      let courses;
      if (category_id) {
        courses = await CourseModel.getCoursesByCategory(category_id);
      } else {
        courses = await CourseModel.getAllCourses();
      }

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

  // ✅ لجلب محتوى الكورس (modules + lessons)
  async getCourseContent(req, res) {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ error: "Invalid course ID" });

    try {
      const courseContent = await CourseModel.getCourseContentById(id);
      if (!courseContent)
        return res.status(404).json({ error: "Course not found" });

      res.json(courseContent);
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

  // ✅ NEW: Get courses by instructor ID
  async getByInstructorId(req, res) {
    const { instructorId } = req.params;
    if (isNaN(instructorId))
      return res.status(400).json({ error: "Invalid instructor ID" });

    try {
      const courses = await CourseModel.getCoursesByInstructorId(instructorId);
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ✅ NEW: Get enrolled courses by user ID
  async getByUserId(req, res) {
    const { userId } = req.params;
    if (isNaN(userId))
      return res.status(400).json({ error: "Invalid user ID" });

    try {
      const courses = await CourseModel.getCoursesByUserId(userId);
      res.json(courses);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
