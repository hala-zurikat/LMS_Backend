import { query } from "../config/db.js";

const QuizModel = {
  async getAll() {
    try {
      const res = await query("SELECT * FROM quizzes ORDER BY created_at DESC");
      return res.rows; // parsing done in controller
    } catch (error) {
      throw new Error("Error fetching quizzes: " + error.message);
    }
  },

  async getById(id) {
    try {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid quiz id");

      const res = await query("SELECT * FROM quizzes WHERE id = $1", [id]);
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0]; // parsing done in controller
    } catch (error) {
      throw new Error("Error fetching quiz by id: " + error.message);
    }
  },

  async getByLessonId(lesson_id) {
    try {
      if (!Number.isInteger(lesson_id) || lesson_id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query(
        "SELECT * FROM quizzes WHERE lesson_id = $1 ORDER BY created_at DESC",
        [lesson_id]
      );
      return res.rows; // parsing done in controller
    } catch (error) {
      throw new Error("Error fetching quizzes by lesson id: " + error.message);
    }
  },

  async create({
    lesson_id,
    question,
    options,
    correct_answer,
    max_score = 10,
  }) {
    try {
      if (!Number.isInteger(lesson_id) || lesson_id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query(
        `INSERT INTO quizzes (lesson_id, question, options, correct_answer, max_score)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          lesson_id,
          question,
          options, // assumed already stringified in controller
          correct_answer,
          max_score,
        ]
      );
      return res.rows[0];
    } catch (error) {
      throw new Error("Error creating quiz: " + error.message);
    }
  },

  async update(
    id,
    { lesson_id, question, options, correct_answer, max_score = 10 }
  ) {
    try {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid quiz id");
      if (!Number.isInteger(lesson_id) || lesson_id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query(
        `UPDATE quizzes 
         SET lesson_id = $1, question = $2, options = $3, correct_answer = $4, max_score = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 RETURNING *`,
        [
          lesson_id,
          question,
          options, // assumed already stringified in controller
          correct_answer,
          max_score,
          id,
        ]
      );
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    } catch (error) {
      throw new Error("Error updating quiz: " + error.message);
    }
  },

  async delete(id) {
    try {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid quiz id");

      const res = await query("DELETE FROM quizzes WHERE id = $1 RETURNING *", [
        id,
      ]);
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    } catch (error) {
      throw new Error("Error deleting quiz: " + error.message);
    }
  },

  async exists(id) {
    try {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid quiz id");

      const res = await query("SELECT 1 FROM quizzes WHERE id = $1", [id]);
      return res.rows.length > 0;
    } catch (error) {
      throw new Error("Error checking quiz existence: " + error.message);
    }
  },
};

export default QuizModel;
