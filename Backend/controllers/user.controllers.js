import {
  createUser,
  getAll,
  getById,
  getByEmail,
  updateUser,
  deactivateUser,
} from "../models/user.models.js";

export const addUser = async (req, res) => {
  try {
    const { name, email, passwordHash, role } = req.body;
    const newUser = await createUser(name, email, passwordHash, role);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getAll();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users!" });
    }
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const getUser_Id = async (req, res) => {
  try {
    const user = await getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found!" });
    else res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
export const getUser_email = async (req, res) => {
  try {
    const user = await getByEmail(req.params.email);
    if (!user) return res.status(404).json({ message: "User not found!" });
    else res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { name, email, avatar, role, is_active } = req.body;
    const updatedUser = await updateUser(
      req.params.id,
      name,
      email,
      avatar,
      role,
      is_active
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await deactivateUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
