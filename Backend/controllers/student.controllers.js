// controllers/studentController.js
import { createResponse } from "../utils/helper.js";
import pool from "../db.js"; // pg connection

export const getStudentDashboardData = async (req, res) => {
  const userId = req.user.id;

  try {
    const userResult = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );

    const coursesResult = await pool.query(
      `SELECT c.id, c.title, c.description, e.progress
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = $1`,
      [userId]
    );

    res.json(
      createResponse(true, "Dashboard data fetched", {
        user: userResult.rows[0],
        courses: coursesResult.rows,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(createResponse(false, "Server error", null, error.message));
  }
};
