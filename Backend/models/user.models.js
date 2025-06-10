import { query } from "../config/db.js";
import bcrypt from "bcrypt";

export const UserModel = {
  async createUser(data) {
    try {
      const {
        name,
        email,
        password_hash,
        role,
        oauth_provider,
        oauth_id,
        is_active,
        avatar,
      } = data;

      let hashedPassword = null;
      if (password_hash) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password_hash, saltRounds);
      }

      const result = await query(
        `INSERT INTO users 
          (name, email, password_hash, role, oauth_provider, oauth_id, is_active, avatar)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          name,
          email,
          hashedPassword,
          role,
          oauth_provider,
          oauth_id,
          is_active ?? true,
          avatar,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  },

  async getAllUsers() {
    try {
      const result = await query("SELECT * FROM users");
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  },

  async getUserById(id) {
    try {
      const result = await query("SELECT * FROM users WHERE id = $1", [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error("Error fetching user: " + error.message);
    }
  },

  async updateUser(id, data) {
    try {
      const {
        name,
        email,
        password_hash,
        role,
        oauth_provider,
        oauth_id,
        is_active,
        avatar,
      } = data;

      let hashedPassword = null;
      if (password_hash) {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password_hash, saltRounds);
      }

      const result = await query(
        `UPDATE users SET 
        name = $1,
        email = $2,
        password_hash = $3,
        role = $4,
        oauth_provider = $5,
        oauth_id = $6,
        is_active = $7,
        avatar = $8,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
        [
          name,
          email,
          hashedPassword,
          role,
          oauth_provider,
          oauth_id,
          is_active,
          avatar,
          id,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  },

  async deleteUser(id) {
    try {
      const result = await query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error deleting user: " + error.message);
    }
  },
};
