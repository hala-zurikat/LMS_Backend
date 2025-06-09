import {
  createUser,
  getAll,
  getById,
  getByEmail,
  updateUser,
  deactivateUser,
} from "../models/user.models.js";
import bcrypt from "bcryptjs";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/user.validation.js";
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, avatar, password, role } = req.body;
    const newUser = await createUser({ name, email, avatar, password, role });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getAll();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser_Id = async (req, res) => {
  try {
    const user = await getById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser_email = async (req, res) => {
  try {
    const user = await getByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { name, email, avatar, role, is_active } = req.body;

    const updatedUser = await updateUser({
      id,
      name,
      email,
      avatar,
      role,
      is_active,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedUser = await deactivateUser(id);
    res.status(200).json({
      message: "User deactivated successfully",
      user: deletedUser,
    });
  } catch (err) {
    console.error("Error in deleteUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};
