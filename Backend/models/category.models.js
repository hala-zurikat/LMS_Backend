import { query } from "../config/db.js";

// Create
export const createCategory = async (name) => {
  const result = await query(
    "INSERT INTO categories (name, created_at) VALUES ($1, NOW()) RETURNING *",
    [name]
  );
  return result.rows[0];
};

// Read All
export const getAllCategories = async () => {
  const result = await query("SELECT * FROM categories ORDER BY id");
  return result.rows;
};

// Read by ID
export const getCategoryById = async (id) => {
  const result = await query("SELECT * FROM categories WHERE id = $1", [id]);
  return result.rows[0];
};

// Update
export const updateCategory = async (id, name) => {
  const result = await query(
    "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
    [name, id]
  );
  return result.rows[0];
};

// Delete
export const deleteCategory = async (id) => {
  await query("DELETE FROM categories WHERE id = $1", [id]);
};
