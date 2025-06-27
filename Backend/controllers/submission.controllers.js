import SubmissionModel from "../models/submission.models.js";
// لا تستخدم submissionSchema هنا في التحديث الجزئي، أو تستخدم schema خاص بالتحديث الجزئي

const submissionController = {
  async getAll(req, res) {
    try {
      const submissions = await SubmissionModel.getAll();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid submission id" });

      const submission = await SubmissionModel.getById(id);
      if (!submission)
        return res.status(404).json({ error: "Submission not found" });

      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByAssignmentId(req, res) {
    try {
      const assignment_id = parseInt(req.params.assignment_id, 10);
      if (isNaN(assignment_id))
        return res.status(400).json({ error: "Invalid assignment id" });

      const submissions = await SubmissionModel.getByAssignmentId(
        assignment_id
      );
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByUserId(req, res) {
    try {
      const user_id = parseInt(req.params.user_id, 10);
      if (isNaN(user_id))
        return res.status(400).json({ error: "Invalid user id" });

      const submissions = await SubmissionModel.getByUserId(user_id);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async create(req, res) {
    try {
      const { assignment_id, user_id, submission_url, submitted_at } = req.body;

      if (!assignment_id || !user_id || !submission_url) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newSubmission = await SubmissionModel.create({
        assignment_id,
        user_id,
        submission_url,
        submitted_at: submitted_at || new Date(),
      });

      res.status(201).json(newSubmission);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid submission id" });

      const exists = await SubmissionModel.exists(id);
      if (!exists)
        return res.status(404).json({ error: "Submission not found" });

      const fieldsToUpdate = {};
      const allowedFields = [
        "assignment_id",
        "user_id",
        "submission_url",
        "submitted_at",
        "grade",
        "feedback",
      ];

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          fieldsToUpdate[field] = req.body[field];
        }
      }

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
      }

      const updatedSubmission = await SubmissionModel.update(
        id,
        fieldsToUpdate
      );
      res.json(updatedSubmission);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid submission id" });

      const deletedSubmission = await SubmissionModel.delete(id);
      if (!deletedSubmission)
        return res.status(404).json({ error: "Submission not found" });

      res.json({ message: "Submission deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default submissionController;
