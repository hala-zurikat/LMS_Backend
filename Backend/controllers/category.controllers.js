import { CategoryModel } from "../models/category.models.js";
import { categorySchema } from "../validations/category.validation.js";

export const CategoryController = {
  async getAll(req, res) {
    try {
      const categories = await CategoryModel.getAllCategories();
      res.json(categories);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving categories", details: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid category ID" });

      const category = await CategoryModel.getCategoryById(id);
      if (!category)
        return res.status(404).json({ error: "Category not found" });

      res.json(category);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error retrieving category", details: err.message });
    }
  },

  async create(req, res) {
    try {
      const { error } = categorySchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const newCategory = await CategoryModel.createCategory(req.body);
      res.status(201).json(newCategory);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error creating category", details: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid category ID" });

      const existing = await CategoryModel.getCategoryById(id);
      if (!existing)
        return res.status(404).json({ error: "Category not found" });

      const { error } = categorySchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const updatedCategory = await CategoryModel.updateCategory(id, req.body);
      res.json(updatedCategory);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error updating category", details: err.message });
    }
  },

  async remove(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ error: "Invalid category ID" });

      const existing = await CategoryModel.getCategoryById(id);
      if (!existing)
        return res.status(404).json({ error: "Category not found" });

      const deleted = await CategoryModel.deleteCategory(id);
      res.json({ message: "Category deleted", category: deleted });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error deleting category", details: err.message });
    }
  },
};
