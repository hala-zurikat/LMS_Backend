import { query } from "../config/db.js";

// Get all assignments
export const getAllAssignments = async () => {
  try {
    const result = await query("SELECT * FROM Assignments");
    return result.rows;
  } catch (err) {
    console.error("Error getting all assignments:", err.message);
    throw err;
  }
};

// Get assignment by ID
export const getAssignmentById = async (id) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid assignment ID");

    const result = await query("SELECT * FROM Assignments WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error getting assignment by ID:", err.message);
    throw err;
  }
};

// Create new assignment
export const createAssignment = async ({
  lesson_id,
  title,
  description,
  deadline,
}) => {
  try {
    const result = await query(
      `INSERT INTO Assignments (lesson_id, title, description, deadline)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [lesson_id, title, description, deadline]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating assignment:", err.message);
    throw err;
  }
};

// Update assignment
export const updateAssignment = async (
  id,
  { lesson_id, title, description, deadline }
) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid assignment ID");

    const result = await query(
      `UPDATE Assignments
       SET lesson_id = $1, title = $2, description = $3, deadline = $4
       WHERE id = $5 RETURNING *`,
      [lesson_id, title, description, deadline, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating assignment:", err.message);
    throw err;
  }
};

// Delete assignment
export const deleteAssignment = async (id) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid assignment ID");

    const result = await query(
      "DELETE FROM Assignments WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting assignment:", err.message);
    throw err;
  }
};
