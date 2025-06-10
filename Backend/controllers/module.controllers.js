import { ModuleModel } from "../models/module.models.js";
import { moduleSchema } from "../validations/module.validation.js";

export const ModuleController = {
  async getAll(req, res) {
    try {
      const modules = await ModuleModel.getAll();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    const { id } = req.params;
    try {
      const module = await ModuleModel.getById(id);
      if (!module) return res.status(404).json({ error: "Module not found" });
      res.json(module);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { error } = moduleSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const newModule = await ModuleModel.create(req.body);
      res.status(201).json(newModule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    try {
      const { error } = moduleSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const updated = await ModuleModel.update(id, req.body);
      if (!updated) return res.status(404).json({ error: "Module not found" });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleted = await ModuleModel.delete(id);
      if (!deleted) return res.status(404).json({ error: "Module not found" });

      res.json({ message: "Module deleted", deleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
