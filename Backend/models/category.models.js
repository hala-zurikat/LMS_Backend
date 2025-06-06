import { query } from "../config/db.js";

// Create
export const createCategory = async (name) => {
  try {
    if (!name) {
      throw new Error("Category name is required");
    }

    const result = await query(
      "INSERT INTO categories (name, created_at) VALUES ($1, NOW()) RETURNING *",
      [name]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error creating category:", err.message);
    throw err;
  }
};

// Read All
export const getAllCategories = async () => {
  try {
    const result = await query("SELECT * FROM categories ORDER BY id");
    return result.rows;
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    throw err;
  }
};

// Read by ID
export const getCategoryById = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("Invalid category ID");
    }

    const result = await query("SELECT * FROM categories WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      throw new Error(`Category with id ${id} not found`);
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching category by ID:", err.message);
    throw err;
  }
};

// Update
export const updateCategory = async (id, name) => {
  try {
    if (isNaN(id)) {
      throw new Error("Invalid category ID");
    }
    if (!name) {
      throw new Error("Category name is required");
    }

    const result = await query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    if (result.rowCount === 0) {
      throw new Error(`Category with id ${id} not found`);
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating category:", err.message);
    throw err;
  }
};

// Delete
export const deleteCategory = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("Invalid category ID");
    }

    const result = await query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      throw new Error(`Category with id ${id} not found`);
    }

    return result.rows[0]||null;
  } catch (err) {
    console.error("Error deleting category:", err.message);
    throw err;
  }
};
