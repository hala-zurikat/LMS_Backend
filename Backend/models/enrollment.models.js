// models/enrollmentModel.js
import { query } from "../config/db.js";

export const EnrollmentModel = {
  async getAll() {
    try {
      const result = await query("SELECT * FROM enrollments ORDER BY id");
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching enrollments: " + error.message);
    }
  },

  async getById(id) {
    try {
      const result = await query("SELECT * FROM enrollments WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error("Error fetching enrollment by ID: " + error.message);
    }
  },
  async findByUserAndCourse(user_id, course_id) {
    try {
      const result = await query(
        "SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2 LIMIT 1",
        [user_id, course_id]
      );
      return result.rows[0] || null; // إذا موجودة ترجع الصف، إذا مش موجودة ترجع null
    } catch (error) {
      throw new Error(
        "Error finding enrollment by user and course: " + error.message
      );
    }
  },
  async findCoursesByUser(user_id) {
    try {
      const result = await query(
        `
      SELECT 
        c.id AS course_id,
        c.title,
        c.description,
        c.thumbnail_url,
        u.name AS instructor_name,
        e.progress
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
      `,
        [user_id]
      );
      return result.rows;
    } catch (error) {
      throw new Error(
        "Error fetching enrolled courses for user: " + error.message
      );
    }
  },

  async create(data) {
    try {
      const { user_id, course_id, enrolled_at, completed_at, progress } = data;
      const result = await query(
        `INSERT INTO enrollments (user_id, course_id, enrolled_at, completed_at, progress)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [user_id, course_id, enrolled_at, completed_at, progress ?? 0]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error creating enrollment: " + error.message);
    }
  },
  async updateProgress(user_id, course_id, progress) {
    const result = await db.query(
      `UPDATE enrollments SET progress = $1
     WHERE user_id = $2 AND course_id = $3 RETURNING *`,
      [progress, user_id, course_id]
    );
    return result.rows[0];
  },

  async update(id, data) {
    try {
      const { user_id, course_id, enrolled_at, completed_at, progress } = data;
      const result = await query(
        `UPDATE enrollments SET 
          user_id = $1,
          course_id = $2,
          enrolled_at = $3,
          completed_at = $4,
          progress = $5
        WHERE id = $6 RETURNING *`,
        [user_id, course_id, enrolled_at, completed_at, progress, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating enrollment: " + error.message);
    }
  },

  async delete(id) {
    try {
      const result = await query(
        "DELETE FROM enrollments WHERE id = $1 RETURNING *",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error deleting enrollment: " + error.message);
    }
  },
};
