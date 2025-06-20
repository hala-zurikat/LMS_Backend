import { query } from "../config/db.js";

export const ModuleModel = {
  async getAll() {
    try {
      const result = await query("SELECT * FROM modules ORDER BY id");
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching modules: " + error.message);
    }
  },

  async getById(id) {
    try {
      const result = await query("SELECT * FROM modules WHERE id = $1", [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error("Error fetching module by ID: " + error.message);
    }
  },
  async getModulesWithLessonsByCourseId(courseId) {
    try {
      const modulesResult = await query(
        `SELECT * FROM modules WHERE course_id = $1 ORDER BY "order"`,
        [courseId]
      );
      const modules = modulesResult.rows;

      for (const module of modules) {
        const lessonsResult = await query(
          `SELECT * FROM lessons WHERE module_id = $1 ORDER BY "order"`,
          [module.id]
        );
        module.lessons = lessonsResult.rows;
      }

      return modules;
    } catch (error) {
      throw new Error("Error fetching modules and lessons: " + error.message);
    }
  },
  async create(data) {
    try {
      const { course_id, title, description, order } = data;
      const result = await query(
        `INSERT INTO modules (course_id, title, description, "order")
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [course_id, title, description, order]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error creating module: " + error.message);
    }
  },

  async update(id, data) {
    try {
      const { course_id, title, description, order } = data;
      const result = await query(
        `UPDATE modules SET 
           course_id = $1,
           title = $2,
           description = $3,
           "order" = $4,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [course_id, title, description, order, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating module: " + error.message);
    }
  },

  async delete(id) {
    try {
      const result = await query(
        "DELETE FROM modules WHERE id = $1 RETURNING *",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error deleting module: " + error.message);
    }
  },
};
