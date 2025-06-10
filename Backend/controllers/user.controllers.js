import { UserModel } from "../models/user.models.js";
import { userSchema, userIdSchema } from "../validations/user.validation.js";

export const UserController = {
  async create(req, res) {
    try {
      const { error } = userSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const user = await UserModel.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAll(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getById(req, res) {
    try {
      const { error } = userIdSchema.validate(req.params.id);
      if (error) return res.status(400).json({ error: "Invalid user ID" });

      const user = await UserModel.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async update(req, res) {
    try {
      const idValidation = userIdSchema.validate(req.params.id);
      const bodyValidation = userSchema.validate(req.body);
      if (idValidation.error)
        return res.status(400).json({ error: "Invalid user ID" });
      if (bodyValidation.error)
        return res
          .status(400)
          .json({ error: bodyValidation.error.details[0].message });

      const updated = await UserModel.updateUser(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "User not found" });

      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async delete(req, res) {
    try {
      const { error } = userIdSchema.validate(req.params.id);
      if (error) return res.status(400).json({ error: "Invalid user ID" });

      const deleted = await UserModel.deleteUser(req.params.id);
      if (!deleted) return res.status(404).json({ error: "User not found" });

      res
        .status(200)
        .json({ message: "User deleted successfully", user: deleted });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
