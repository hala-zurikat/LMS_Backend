// controllers/enrollmentController.js
import { EnrollmentModel } from "../models/enrollment.models.js";
import { enrollmentSchema } from "../validations/enrollment.validation.js";

export const EnrollmentController = {
  async getAll(req, res) {
    try {
      const enrollments = await EnrollmentModel.getAll();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    const { id } = req.params;
    try {
      const enrollment = await EnrollmentModel.getById(id);
      if (!enrollment)
        return res.status(404).json({ error: "Enrollment not found" });
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { error } = enrollmentSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const newEnrollment = await EnrollmentModel.create(req.body);
      res.status(201).json(newEnrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    try {
      const { error } = enrollmentSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const updated = await EnrollmentModel.update(id, req.body);
      if (!updated)
        return res.status(404).json({ error: "Enrollment not found" });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleted = await EnrollmentModel.delete(id);
      if (!deleted)
        return res.status(404).json({ error: "Enrollment not found" });

      res.json({ message: "Enrollment deleted", deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
