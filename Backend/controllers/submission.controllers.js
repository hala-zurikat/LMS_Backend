import SubmissionModel from "../models/submission.models.js";
import { submissionSchema } from "../validations/submission.validation.js";

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
      const { error, value } = submissionSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const newSubmission = await SubmissionModel.create(value);
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

      const { error, value } = submissionSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const updatedSubmission = await SubmissionModel.update(id, value);
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
