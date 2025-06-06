import { query } from "../config/db.js";

// Get all lessons
export const getAllLessons = async () => {
  try {
    const result = await query(
      'SELECT * FROM lessons ORDER BY module_id, "order"'
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching lessons:", err.message);
    throw err;
  }
};

// Get lesson by ID
export const getLessonById = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("invalid lesson id");
    }
    const result = await query("SELECT * FROM lessons WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching lesson by ID:", err.message);
    throw err;
  }
};

// Update lesson
export const updateLesson = async (id, lesson) => {
  try {
     if (isNaN(id)) {
      throw new Error("invalid lesson id");
    }
    const {
      module_id,
      title,
      content_type,
      content_url,
      duration,
      order,
      is_free,
    } = lesson;

    const result = await query(
      `UPDATE lessons SET 
        module_id = $1,
        title = $2,
        content_type = $3,
        content_url = $4,
        duration = $5,
        "order" = $6,
        is_free = $7,
        updated_at = NOW()
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

    if (result.rowCount === 0) {
      throw new Error(`Lesson with id ${id} not found`);
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating lesson:", err.message);
    throw err;
  }
};

// Create a lesson
export const createLesson = async (lesson) => {
  try {
    const {
      module_id,
      title,
      content_type,
      content_url,
      duration,
      order,
      is_free,
    } = lesson;

    const result = await query(
      `INSERT INTO lessons (module_id, title, content_type, content_url, duration, "order", is_free, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [module_id, title, content_type, content_url, duration, order, is_free]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error creating lesson:", err.message);
    throw err;
  }
};

// Delete lesson
export const deleteLesson = async (id) => {
  try {
     if (isNaN(id)) {
      throw new Error("invalid lesson id");
    }
    const result = await query(
      "DELETE FROM lessons WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      throw new Error(`Lesson with id ${id} not found`);
    }

    return result.rows[0]||null;
  } catch (err) {
    console.error("Error deleting lesson:", err.message);
    throw err;
  }
};
