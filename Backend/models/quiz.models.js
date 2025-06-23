import { query } from "../config/db.js";

const QuizModel = {
  async getAll() {
    const res = await query("SELECT * FROM quizzes ORDER BY created_at DESC");
    return res.rows;
  },

  async getById(id) {
    const res = await query("SELECT * FROM quizzes WHERE id = $1", [id]);
    return res.rows[0] || null;
  },

  async getByLessonId(lesson_id) {
    const res = await query(
      "SELECT * FROM quizzes WHERE lesson_id = $1 ORDER BY created_at DESC",
      [lesson_id]
    );
    return res.rows;
  },

  async create({
    lesson_id,
    question,
    options,
    correct_answer,
    max_score = 10,
  }) {
    const res = await query(
      `INSERT INTO quizzes (lesson_id, question, options, correct_answer, max_score)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [lesson_id, question, options, correct_answer, max_score]
    );
    return res.rows[0];
  },

  async update(
    id,
    { lesson_id, question, options, correct_answer, max_score = 10 }
  ) {
    const res = await query(
      `UPDATE quizzes SET lesson_id = $1, question = $2, options = $3, correct_answer = $4,
       max_score = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
      [lesson_id, question, options, correct_answer, max_score, id]
    );
    return res.rows[0] || null;
  },

  async delete(id) {
    const res = await query("DELETE FROM quizzes WHERE id = $1 RETURNING *", [
      id,
    ]);
    return res.rows[0] || null;
  },

  async exists(id) {
    const res = await query("SELECT 1 FROM quizzes WHERE id = $1", [id]);
    return res.rows.length > 0;
  },

  async getGroupedByCourseAndModule() {
    const result = await query(`
      SELECT
        c.id AS course_id,
        c.title AS course_title,
        m.id AS module_id,
        m.title AS module_title,
        q.id AS quiz_id,
        q.question,
        q.options,
        q.correct_answer
      FROM quizzes q
      JOIN lessons l ON q.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      ORDER BY c.title, m."order", q.id
    `);

    const grouped = {};
    result.rows.forEach((row) => {
      const {
        course_id,
        course_title,
        module_id,
        module_title,
        quiz_id,
        question,
        options,
        correct_answer,
      } = row;

      if (!grouped[course_id]) {
        grouped[course_id] = { course_id, course_title, modules: {} };
      }
      if (!grouped[course_id].modules[module_id]) {
        grouped[course_id].modules[module_id] = {
          module_id,
          module_title,
          quizzes: [],
        };
      }
      grouped[course_id].modules[module_id].quizzes.push({
        id: quiz_id,
        question,
        options: Array.isArray(options) ? options : [],
        correct_answer,
      });
    });

    return Object.values(grouped).map((course) => ({
      ...course,
      modules: Object.values(course.modules),
    }));
  },
};

export default QuizModel;
