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
  async getAssignmentsWithSubmissionsByInstructor(instructorId) {
    try {
      if (!Number.isInteger(instructorId) || instructorId <= 0)
        throw new Error("Invalid instructor ID");

      const res = await query(
        `
      SELECT 
        a.id AS assignment_id,
        a.title AS assignment_title,
        a.description,
        a.deadline,
        a.lesson_id,
        l.title AS lesson_title,
        c.id AS course_id,
        c.title AS course_title,
        s.id AS submission_id,
        s.user_id,
        s.submission_url,
        s.submitted_at,
        s.grade,
        u.name AS user_name
      FROM assignments a
      JOIN lessons l ON a.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      LEFT JOIN submissions s ON s.assignment_id = a.id
      LEFT JOIN users u ON u.id = s.user_id
      WHERE c.instructor_id = $1
      ORDER BY a.created_at DESC, s.submitted_at DESC
      `,
        [instructorId]
      );

      // الآن نرتب النتائج كمجموعة واجبات، كل واجب يحتوي على submissions[]
      const assignmentMap = new Map();

      res.rows.forEach((row) => {
        if (!assignmentMap.has(row.assignment_id)) {
          assignmentMap.set(row.assignment_id, {
            id: row.assignment_id,
            title: row.assignment_title,
            description: row.description,
            deadline: row.deadline,
            lesson_title: row.lesson_title,
            course_id: row.course_id,
            course_title: row.course_title,
            submissions: [],
          });
        }

        if (row.submission_id) {
          assignmentMap.get(row.assignment_id).submissions.push({
            id: row.submission_id,
            user_id: row.user_id,
            user_name: row.user_name,
            submission_url: row.submission_url,
            submitted_at: row.submitted_at,
            grade: row.grade,
          });
        }
      });

      return Array.from(assignmentMap.values());
    } catch (error) {
      throw new Error(
        "Error fetching instructor assignments with submissions: " +
          error.message
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
        c.title AS course_title,
        s.id AS submission_id,
        s.submission_url,
        s.submitted_at,
        s.grade
      FROM assignments a
      JOIN lessons l ON a.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN submissions s 
        ON s.assignment_id = a.id AND s.user_id = $1
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
