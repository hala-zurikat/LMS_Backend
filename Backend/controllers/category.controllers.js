import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../models/category.models.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation.js";
// Create
export const addCategory = async (req, res) => {
  try {
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name } = req.body;
    const newCategory = await createCategory(name);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read All
export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read by ID
export const getCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: "Invalid category ID" });

    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const editCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: "Invalid category ID" });

    const { error } = updateCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: err.details[0].message });
    }

    const { name } = req.body;
    const updatedCategory = await updateCategory(id, name);
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
export const removeCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id))
      return res.status(400).json({ error: "Invalid category ID" });

    const deletedCategory = await deleteCategory(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
