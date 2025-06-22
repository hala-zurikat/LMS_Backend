import { query } from "../config/db.js";

export const CourseAdminModel = {
  async getAllCourses() {
    try {
      const result = await query(`
        SELECT c.*, u.name as instructor_name, cat.name as category_name
        FROM courses c
        JOIN users u ON c.instructor_id = u.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        ORDER BY c.created_at DESC
      `);
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching courses: " + error.message);
    }
  },

  async getCourseContentById(courseId) {
    try {
      // 1. جلب بيانات الكورس الأساسي
      const courseResult = await query(
        `SELECT c.*, u.name as instructor_name, cat.name as category_name
         FROM courses c
         JOIN users u ON c.instructor_id = u.id
         LEFT JOIN categories cat ON c.category_id = cat.id
         WHERE c.id = $1`,
        [courseId]
      );
      if (courseResult.rowCount === 0) return null;
      const course = courseResult.rows[0];

      // 2. جلب الموديولات المرتبطة بالكورس
      const modulesResult = await query(
        `SELECT * FROM modules WHERE course_id = $1 ORDER BY "order" ASC`,
        [courseId]
      );
      const modules = modulesResult.rows;

      // 3. جلب الدروس لكل موديول
      for (const module of modules) {
        const lessonsResult = await query(
          `SELECT * FROM lessons WHERE module_id = $1 ORDER BY "order" ASC`,
          [module.id]
        );
        module.lessons = lessonsResult.rows;
      }

      // 4. إرجاع كائن يجمع بيانات الكورس مع الموديولات والدروس
      return {
        ...course,
        modules,
      };
    } catch (error) {
      throw new Error("Error fetching course content: " + error.message);
    }
  },

  async updateCourseApproval(courseId, approve) {
    try {
      const result = await query(
        `UPDATE courses SET is_approved = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [approve, courseId]
      );

      if (result.rowCount === 0) {
        throw new Error("Course not found");
      }
      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating course approval: " + error.message);
    }
  },
};
