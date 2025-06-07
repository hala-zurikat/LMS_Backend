import * as SubmissionModel from "../models/submission.models.js";
import { submissionSchema } from "../validations/submission.validation.js";

export const getAll = async (req, res) => {
  try {
    const data = await SubmissionModel.getAllSubmissions();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get submissions", error: err.message });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const submission = await SubmissionModel.getSubmissionById(id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  const { error } = submissionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const created = await SubmissionModel.createSubmission(req.body);
    res.status(201).json(created);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create submission", error: err.message });
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = submissionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updated = await SubmissionModel.updateSubmission(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await SubmissionModel.deleteSubmission(id);
    if (!deleted)
      return res.status(404).json({ message: "Submission not found" });
    res.json({ message: "Submission deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
