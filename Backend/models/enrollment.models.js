import { query } from "../config/db.js";

// Get all enrollments
export const getAllEnrollments = async () => {
  try {
    const result = await query("SELECT * FROM Enrollments");
    return result.rows;
  } catch (err) {
    console.error("Error fetching all enrollments:", err.message);
    throw err;
  }
};

// Get enrollment by ID
export const getEnrollmentById = async (id) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid enrollment ID");

    const result = await query("SELECT * FROM Enrollments WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching enrollment by ID:", err.message);
    throw err;
  }
};

// Create new enrollment
export const createEnrollment = async ({
  user_id,
  course_id,
  enrolled_at,
  completed_at,
  progress,
}) => {
  try {
    const result = await query(
      `INSERT INTO Enrollments (user_id, course_id, enrolled_at, completed_at, progress)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, course_id, enrolled_at, completed_at, progress]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating enrollment:", err.message);
    throw err;
  }
};

// Update enrollment
export const updateEnrollment = async (
  id,
  { user_id, course_id, enrolled_at, completed_at, progress }
) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid enrollment ID");

    const result = await query(
      `UPDATE Enrollments SET user_id = $1, course_id = $2, enrolled_at = $3, completed_at = $4, progress = $5
       WHERE id = $6 RETURNING *`,
      [user_id, course_id, enrolled_at, completed_at, progress, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating enrollment:", err.message);
    throw err;
  }
};

// Delete enrollment
export const deleteEnrollment = async (id) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid enrollment ID");

    const result = await query(
      "DELETE FROM Enrollments WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting enrollment:", err.message);
    throw err;
  }
};
