import {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../models/enrollment.models.js";

import { enrollmentSchema } from "../validations/enrollment.validation.js";

export const getAll = async (req, res) => {
  try {
    const data = await getAllEnrollments();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getOne = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ message: "Invalid ID" });

  try {
    const data = await getEnrollmentById(id);
    if (!data) return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const create = async (req, res) => {
  const { error } = enrollmentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const created = await createEnrollment(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ message: "Invalid ID" });

  const { error } = enrollmentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updated = await updateEnrollment(id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const remove = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ message: "Invalid ID" });

  try {
    const deleted = await deleteEnrollment(id);
    if (!deleted)
      return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json({ message: "Enrollment deleted", deleted });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
