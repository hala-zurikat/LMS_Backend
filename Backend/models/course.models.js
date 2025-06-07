import { query } from "../config/db.js";

// Get all courses
export const getAllCourses = async () => {
  try {
    const result = await query("SELECT * FROM Courses");
    return result.rows;
  } catch (err) {
    console.error("Error getting courses:", err.message);
    throw err;
  }
};

// Get course by ID
export const getCourseById = async (id) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid course ID");

    const result = await query("SELECT * FROM Courses WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error getting course:", err.message);
    throw err;
  }
};

// Create new course
export const createCourse = async ({
  title,
  description,
  instructor_id,
  category,
  created_at,
  updated_at,
}) => {
  try {
    const result = await query(
      `INSERT INTO Courses (title, description, instructor_id, category, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, instructor_id, category, created_at, updated_at]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating course:", err.message);
    throw err;
  }
};

// Update course
export const updateCourse = async (
  id,
  { title, description, instructor_id, category, created_at, updated_at }
) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid course ID");

    const result = await query(
      `UPDATE Courses
       SET title = $1, description = $2, instructor_id = $3, category = $4, created_at = $5, updated_at = $6
       WHERE id = $7 RETURNING *`,
      [title, description, instructor_id, category, created_at, updated_at, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating course:", err.message);
    throw err;
  }
};

// Delete course
export const deleteCourse = async (id) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid course ID");

    const result = await query(
      "DELETE FROM Courses WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting course:", err.message);
    throw err;
  }
};
