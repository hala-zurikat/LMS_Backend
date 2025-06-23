import { query } from "../config/db.js";

const CourseModel = {
  async getCoursesByInstructorId(instructorId) {
    const result = await query(
      `SELECT 
       c.*, 
       u.name AS instructor_name 
     FROM courses c
     JOIN users u ON c.instructor_id = u.id
     WHERE c.instructor_id = $1`,
      [instructorId]
    );
    return result.rows;
  },
  async createCourse(courseData) {
    const result = await query(
      `INSERT INTO courses (title, description, instructor_id, category_id, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [
        courseData.title,
        courseData.description,
        courseData.instructor_id,
        courseData.category_id,
      ]
    );
    return result.rows[0];
  },

  async getCourseById(id) {
    const result = await query(
      `SELECT 
        c.*, 
        u.name AS instructor_name
     FROM courses c
     JOIN users u ON c.instructor_id = u.id
     WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  },
  async updateCourse(id, data) {
    const result = await query(
      `UPDATE courses SET title = $1, description = $2, category_id = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [data.title, data.description, data.category_id, id]
    );
    return result.rows[0];
  },

  async deleteCourse(id) {
    await query("DELETE FROM courses WHERE id = $1", [id]);
  },
};

export { CourseModel };
