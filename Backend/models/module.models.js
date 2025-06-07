import { query } from "../config/db.js";

// Create new module
export const createModule = async ({
  course_id,
  title,
  description,
  order,
}) => {
  try {
    if (!course_id) {
      throw new Error("Course ID is required to create a module");
    }

    // Check if the same order already exists in this course
    const existing = await query(
      "SELECT * FROM modules WHERE course_id = $1 AND order = $2",
      [course_id, order]
    );
    if (existing.rowCount > 0) {
      throw new Error(
        `A module with order ${order} already exists in this course`
      );
    }

    const result = await query(
      "INSERT INTO modules (course_id, title, description, order) VALUES ($1, $2, $3, $4) RETURNING *",
      [course_id, title, description, order]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error creating module:", err.message);
    throw err;
  }
};

// Update module
export const updateModule = async ({ id, course_id, description, order }) => {
  try {
    if (isNaN(id)) {
      throw new Error("Invalid module ID");
    }

    // Check if another module with same course_id and order exists (excluding this one)
    const existing = await query(
      "SELECT * FROM modules WHERE course_id = $1 AND order = $2 AND id != $3",
      [course_id, order, id]
    );
    if (existing.rowCount > 0) {
      throw new Error(
        `Another module with order ${order} already exists in this course`
      );
    }

    const result = await query(
      "UPDATE modules SET course_id = $1, description = $2, order = $3 WHERE id = $4 RETURNING *",
      [course_id, description, order, id]
    );

    if (result.rowCount === 0) {
      throw new Error(`Module with ID ${id} not found`);
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating module:", err.message);
    throw err;
  }
};

// Get all modules
export const getAllModules = async () => {
  try {
    const result = await query("SELECT * FROM modules");
    return result.rows;
  } catch (err) {
    console.error("Error fetching modules:", err.message);
    throw err;
  }
};

// Get modules by course ID (ordered)
export const getModulesByCourseId = async (course_id) => {
  try {
    if (!course_id) {
      throw new Error("Course ID is required");
    }

    const result = await query(
      "SELECT * FROM modules WHERE course_id = $1 ORDER BY order ASC",
      [course_id]
    );

    return result.rows;
  } catch (err) {
    console.error("Error fetching modules by course ID:", err.message);
    throw err;
  }
};

// Delete module
export const deleteModule = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("Invalid module ID");
    }

    const result = await query(
      "DELETE FROM modules WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      throw new Error(`Module with ID ${id} not found`);
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error deleting module:", err.message);
    throw err;
  }
};
