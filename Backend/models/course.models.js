import { query } from "../config/db.js";

export const CourseModel = {
  async getAllCourses() {
    try {
      const result = await query("SELECT * FROM courses ORDER BY id");
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching courses: " + error.message);
    }
  },

  async getCourseById(id) {
    try {
      const result = await query("SELECT * FROM courses WHERE id = $1", [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error("Error fetching course: " + error.message);
    }
  },

  async createCourse(data) {
    try {
      const {
        title,
        description,
        instructor_id,
        category_id,
        price,
        thumbnail_url,
        is_published,
        is_approved,
      } = data;

      const result = await query(
        `INSERT INTO courses (title, description, instructor_id, category_id, price, thumbnail_url, is_published, is_approved)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          title,
          description,
          instructor_id,
          category_id,
          price ?? 0.0,
          thumbnail_url,
          is_published ?? false,
          is_approved ?? false,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error creating course: " + error.message);
    }
  },

  async updateCourse(id, data) {
    try {
      const {
        title,
        description,
        instructor_id,
        category_id,
        price,
        thumbnail_url,
        is_published,
        is_approved,
      } = data;

      const result = await query(
        `UPDATE courses SET
          title = $1,
          description = $2,
          instructor_id = $3,
          category_id = $4,
          price = $5,
          thumbnail_url = $6,
          is_published = $7,
          is_approved = $8,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [
          title,
          description,
          instructor_id,
          category_id,
          price,
          thumbnail_url,
          is_published,
          is_approved,
          id,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating course: " + error.message);
    }
  },

  async deleteCourse(id) {
    try {
      const result = await query(
        `DELETE FROM courses WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error deleting course: " + error.message);
    }
  },
};
