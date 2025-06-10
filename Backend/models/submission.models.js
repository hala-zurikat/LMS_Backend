import { query } from "../config/db.js";

const SubmissionModel = {
  async getAll() {
    try {
      const res = await query(
        "SELECT * FROM submissions ORDER BY submitted_at DESC"
      );
      return res.rows;
    } catch (error) {
      throw new Error("Error fetching submissions: " + error.message);
    }
  },

  async getById(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid submission id");

      const res = await query("SELECT * FROM submissions WHERE id = $1", [id]);
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error fetching submission by id: " + error.message);
    }
  },

  async getByAssignmentId(assignment_id) {
    try {
      if (!Number.isInteger(assignment_id) || assignment_id <= 0)
        throw new Error("Invalid assignment id");

      const res = await query(
        "SELECT * FROM submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC",
        [assignment_id]
      );
      return res.rows;
    } catch (error) {
      throw new Error(
        "Error fetching submissions by assignment id: " + error.message
      );
    }
  },

  async getByUserId(user_id) {
    try {
      if (!Number.isInteger(user_id) || user_id <= 0)
        throw new Error("Invalid user id");

      const res = await query(
        "SELECT * FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC",
        [user_id]
      );
      return res.rows;
    } catch (error) {
      throw new Error(
        "Error fetching submissions by user id: " + error.message
      );
    }
  },

  async create({
    assignment_id,
    user_id,
    submission_url,
    submitted_at = null,
    grade = null,
    feedback = null,
  }) {
    try {
      if (!Number.isInteger(assignment_id) || assignment_id <= 0)
        throw new Error("Invalid assignment id");
      if (!Number.isInteger(user_id) || user_id <= 0)
        throw new Error("Invalid user id");

      const res = await query(
        `INSERT INTO submissions 
         (assignment_id, user_id, submission_url, submitted_at, grade, feedback) 
         VALUES ($1, $2, $3, COALESCE($4, CURRENT_TIMESTAMP), $5, $6) RETURNING *`,
        [assignment_id, user_id, submission_url, submitted_at, grade, feedback]
      );
      return res.rows[0];
    } catch (error) {
      throw new Error("Error creating submission: " + error.message);
    }
  },

  async update(
    id,
    {
      assignment_id,
      user_id,
      submission_url,
      submitted_at = null,
      grade = null,
      feedback = null,
    }
  ) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid submission id");
      if (!Number.isInteger(assignment_id) || assignment_id <= 0)
        throw new Error("Invalid assignment id");
      if (!Number.isInteger(user_id) || user_id <= 0)
        throw new Error("Invalid user id");

      const res = await query(
        `UPDATE submissions SET assignment_id = $1, user_id = $2, submission_url = $3, 
         submitted_at = COALESCE($4, submitted_at), grade = $5, feedback = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING *`,
        [
          assignment_id,
          user_id,
          submission_url,
          submitted_at,
          grade,
          feedback,
          id,
        ]
      );
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error updating submission: " + error.message);
    }
  },

  async delete(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid submission id");

      const res = await query(
        "DELETE FROM submissions WHERE id = $1 RETURNING *",
        [id]
      );
      if (res.rows.length === 0) return null;
      return res.rows[0];
    } catch (error) {
      throw new Error("Error deleting submission: " + error.message);
    }
  },

  async exists(id) {
    try {
      if (!Number.isInteger(id) || id <= 0)
        throw new Error("Invalid submission id");

      const res = await query("SELECT 1 FROM submissions WHERE id = $1", [id]);
      return res.rows.length > 0;
    } catch (error) {
      throw new Error("Error checking submission existence: " + error.message);
    }
  },
};

export default SubmissionModel;
