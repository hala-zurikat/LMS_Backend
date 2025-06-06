import { query } from "../config/db.js";
import bcrypt from "bcryptjs";

// Create new user
export const createUser = async ({ name, email, avatar, password, role }) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const existing = await getByEmail(cleanEmail);
    if (existing) {
      throw new Error("User with this email already exists");
    }
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await query(
      "INSERT INTO users (name, email, avatar, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, avatar, password_hash, role]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Error creating user:", err.message);
    throw err;
  }
};

// Get all users
export const getAll = async () => {
  try {
    const result = await query("SELECT * FROM users");
    return result.rows;
  } catch (err) {
    console.error("Error fetching users:", err.message);
    throw err;
  }
};

// Get user by ID
export const getById = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("invalid user id");
    }
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching user by ID:", err.message);
    throw err;
  }
};

// Get user by Email
export const getByEmail = async (email) => {
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  } catch (err) {
    console.error("Error fetching user by email:", err.message);
    throw err;
  }
};

// Update user
export const updateUser = async ({
  id,
  name,
  email,
  avatar,
  role,
  is_active,
}) => {
  try {
    if (isNaN(id)) {
      throw new Error("invalid user id");
    }
    const result = await query(
      "UPDATE users SET name=$1, email=$2, avatar=$3, role=$4, is_active=$5, updated_at=NOW() WHERE id=$6 RETURNING *",
      [name, email, avatar, role, is_active, id]
    );

    if (result.rowCount === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error updating user:", err.message);
    throw err;
  }
};

// Deactivate user
export const deactivateUser = async (id) => {
  try {
    if (isNaN(id)) {
      throw new Error("invalid user id");
    }
    const result = await query(
      "UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error deactivating user:", err.message);
    throw err;
  }
};
