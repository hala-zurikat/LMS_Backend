import { query } from "../config/db.js";

const AssignmentModel = {
  async getAll() {
    try {
      const res = await query(
        "SELECT * FROM assignments ORDER BY created_at DESC"
      );
      return res.rows;
    } catch (error) {
      throw new Error("Error fetching assignments: " + error.message);
    }
  },

  async getById(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid assignment id");

      const res = await query("SELECT * FROM assignments WHERE id = $1", [id]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error fetching assignment by id: " + error.message);
    }
  },

  async getByLessonId(lesson_id) {
    try {
      if (!Number.isInteger(lesson_id) || lesson_id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query(
        "SELECT * FROM assignments WHERE lesson_id = $1 ORDER BY created_at DESC",
        [lesson_id]
      );
      return res.rows;
    } catch (error) {
      throw new Error(
        "Error fetching assignments by lesson id: " + error.message
      );
    }
  },

  async getAssignmentsByUserId(userId) {
    try {
      if (!Number.isInteger(userId) || userId <= 0)
        throw new Error("Invalid user ID");

      const res = await query(
        `
        SELECT 
          a.*, 
          l.title AS lesson_title,
          m.title AS module_title,
          c.title AS course_title
        FROM assignments a
        JOIN lessons l ON a.lesson_id = l.id
        JOIN modules m ON l.module_id = m.id
        JOIN courses c ON m.course_id = c.id
        JOIN enrollments e ON c.id = e.course_id
        WHERE e.user_id = $1
        ORDER BY a.deadline DESC
        `,
        [userId]
      );
      return res.rows;
    } catch (error) {
      throw new Error("Error fetching assignments for user: " + error.message);
    }
  },

  async create({
    lesson_id,
    title,
    description = null,
    deadline = null,
    max_score = 100,
  }) {
    try {
      if (!Number.isInteger(lesson_id) || lesson_id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query(
        `INSERT INTO assignments (lesson_id, title, description, deadline, max_score)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [lesson_id, title, description, deadline, max_score]
      );
      return res.rows[0];
    } catch (error) {
      throw new Error("Error creating assignment: " + error.message);
    }
  },

  async update(
    id,
    { lesson_id, title, description = null, deadline = null, max_score = 100 }
  ) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid assignment id");
      if (!Number.isInteger(lesson_id) || lesson_id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query(
        `UPDATE assignments SET lesson_id = $1, title = $2, description = $3, deadline = $4, max_score = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 RETURNING *`,
        [lesson_id, title, description, deadline, max_score, id]
      );
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error updating assignment: " + error.message);
    }
  },

  async delete(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid assignment id");

      const res = await query(
        "DELETE FROM assignments WHERE id = $1 RETURNING *",
        [id]
      );
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error deleting assignment: " + error.message);
    }
  },

  async exists(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid assignment id");

      const res = await query("SELECT 1 FROM assignments WHERE id = $1", [id]);
      return res.rows.length > 0;
    } catch (error) {
      throw new Error("Error checking assignment existence: " + error.message);
    }
  },
};

export default AssignmentModel;
