import * as AssignmentModel from "../models/assignment.models.js";
import { assignmentSchema } from "../validations/assignment.validation.js";

// Get all assignments
export const getAll = async (req, res) => {
  try {
    const data = await AssignmentModel.getAllAssignments();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get assignments", error: err.message });
  }
};

// Get assignment by ID
export const getById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const assignment = await AssignmentModel.getAssignmentById(id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Create new assignment
export const create = async (req, res) => {
  const { error } = assignmentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const newAssignment = await AssignmentModel.createAssignment(req.body);
    res.status(201).json(newAssignment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create assignment", error: err.message });
  }
};

// Update assignment
export const update = async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = assignmentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updated = await AssignmentModel.updateAssignment(id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete assignment
export const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await AssignmentModel.deleteAssignment(id);
    if (!deleted)
      return res.status(404).json({ message: "Assignment not found" });
    res.json({ message: "Assignment deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
