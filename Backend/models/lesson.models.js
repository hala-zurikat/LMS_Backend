import { query } from "../config/db.js";

const LessonModel = {
  async getAll() {
    try {
      const res = await query('SELECT * FROM lessons ORDER BY "order" ASC');
      return res.rows;
    } catch (error) {
      throw new Error("Error fetching lessons: " + error.message);
    }
  },

  async getById(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query("SELECT * FROM lessons WHERE id = $1", [id]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error fetching lesson by id: " + error.message);
    }
  },

  async getByModuleId(module_id) {
    try {
      if (!Number.isInteger(module_id) || module_id <= 0)
        throw new Error("Invalid module id");

      const res = await query(
        'SELECT * FROM lessons WHERE module_id = $1 ORDER BY "order" ASC',
        [module_id]
      );
      return res.rows;
    } catch (error) {
      throw new Error("Error fetching lessons by module id: " + error.message);
    }
  },

  async create({
    module_id,
    title,
    content_type,
    content_url = null,
    duration = 0,
    order,
    is_free = false,
  }) {
    try {
      if (!Number.isInteger(module_id) || module_id <= 0)
        throw new Error("Invalid module id");

      const res = await query(
        `INSERT INTO lessons 
          (module_id, title, content_type, content_url, duration, "order", is_free) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [module_id, title, content_type, content_url, duration, order, is_free]
      );
      return res.rows[0];
    } catch (error) {
      throw new Error("Error creating lesson: " + error.message);
    }
  },

  async update(
    id,
    {
      module_id,
      title,
      content_type,
      content_url = null,
      duration = 0,
      order,
      is_free = false,
    }
  ) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid lesson id");
      if (!Number.isInteger(module_id) || module_id <= 0)
        throw new Error("Invalid module id");

      const res = await query(
        `UPDATE lessons SET module_id = $1, title = $2, content_type = $3, content_url = $4, 
         duration = $5, "order" = $6, is_free = $7, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $8 RETURNING *`,
        [
          module_id,
          title,
          content_type,
          content_url,
          duration,
          order,
          is_free,
          id,
        ]
      );
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error updating lesson: " + error.message);
    }
  },

  async delete(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query("DELETE FROM lessons WHERE id = $1 RETURNING *", [
        id,
      ]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error deleting lesson: " + error.message);
    }
  },

  async exists(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid lesson id");

      const res = await query("SELECT 1 FROM lessons WHERE id = $1", [id]);
      return res.rows.length > 0;
    } catch (error) {
      throw new Error("Error checking lesson existence: " + error.message);
    }
  },
};

export default LessonModel;
