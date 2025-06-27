import AssignmentModel from "../models/assignment.models.js";
import { assignmentSchema } from "../validations/assignment.validation.js";

const assignmentController = {
  async getAll(req, res) {
    try {
      const assignments = await AssignmentModel.getAll();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid assignment id" });

      const assignment = await AssignmentModel.getById(id);
      if (!assignment)
        return res.status(404).json({ error: "Assignment not found" });

      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByLessonId(req, res) {
    try {
      const lesson_id = parseInt(req.params.lesson_id, 10);
      if (isNaN(lesson_id))
        return res.status(400).json({ error: "Invalid lesson id" });

      const assignments = await AssignmentModel.getByLessonId(lesson_id);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getByUserId(req, res) {
    try {
      const user_id = parseInt(req.params.user_id, 10);
      if (isNaN(user_id))
        return res.status(400).json({ error: "Invalid user id" });

      const assignments = await AssignmentModel.getAssignmentsByUserId(user_id);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { error, value } = assignmentSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const newAssignment = await AssignmentModel.create(value);
      res.status(201).json(newAssignment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid assignment id" });

      const exists = await AssignmentModel.exists(id);
      if (!exists)
        return res.status(404).json({ error: "Assignment not found" });

      const { error, value } = assignmentSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((e) => e.message) });
      }

      const updatedAssignment = await AssignmentModel.update(id, value);
      res.json(updatedAssignment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid assignment id" });

      const deletedAssignment = await AssignmentModel.delete(id);
      if (!deletedAssignment)
        return res.status(404).json({ error: "Assignment not found" });

      res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default assignmentController;
