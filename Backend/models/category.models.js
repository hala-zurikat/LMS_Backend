import { query } from "../config/db.js";

export const CategoryModel = {
  async getAllCategories() {
    try {
      const result = await query("SELECT * FROM categories ORDER BY id");
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching categories: " + error.message);
    }
  },

  async getCategoryById(id) {
    try {
      const result = await query("SELECT * FROM categories WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error("Error fetching category: " + error.message);
    }
  },

  async createCategory(data) {
    try {
      const { name } = data;
      const result = await query(
        `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
        [name]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error creating category: " + error.message);
    }
  },

  async updateCategory(id, data) {
    try {
      const { name } = data;
      const result = await query(
        `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`,
        [name, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating category: " + error.message);
    }
  },

  async deleteCategory(id) {
    try {
      const result = await query(
        `DELETE FROM categories WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error deleting category: " + error.message);
    }
  },
};
