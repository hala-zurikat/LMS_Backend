import { query } from "../config/db.js";

// Get all submissions
export const getAllSubmissions = async () => {
  try {
    const result = await query("SELECT * FROM Submissions");
    return result.rows;
  } catch (err) {
    console.error("Error getting submissions:", err.message);
    throw err;
  }
};

// Get submission by ID
export const getSubmissionById = async (id) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid submission ID");

    const result = await query("SELECT * FROM Submissions WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error getting submission:", err.message);
    throw err;
  }
};

// Create new submission
export const createSubmission = async ({
  assignment_id,
  user_id,
  submission_url,
  submitted_at,
  grade,
}) => {
  try {
    const result = await query(
      `INSERT INTO Submissions (assignment_id, user_id, submission_url, submitted_at, grade)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [assignment_id, user_id, submission_url, submitted_at, grade]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating submission:", err.message);
    throw err;
  }
};

// Update submission
export const updateSubmission = async (
  id,
  { assignment_id, user_id, submission_url, submitted_at, grade }
) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid submission ID");

    const result = await query(
      `UPDATE Submissions
       SET assignment_id = $1, user_id = $2, submission_url = $3, submitted_at = $4, grade = $5
       WHERE id = $6 RETURNING *`,
      [assignment_id, user_id, submission_url, submitted_at, grade, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating submission:", err.message);
    throw err;
  }
};

// Delete submission
export const deleteSubmission = async (id) => {
  try {
    if (isNaN(id) || id <= 0) throw new Error("Invalid submission ID");

    const result = await query(
      "DELETE FROM Submissions WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error deleting submission:", err.message);
    throw err;
  }
};
