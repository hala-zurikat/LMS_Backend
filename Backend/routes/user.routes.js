import express from "express";
import {
  addUser,
  deleteUser,
  editUser,
  getUser_email,
  getUser_Id,
  getUsers,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:email", getUser_email);
router.get("/:id", getUser_Id);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);
export default router;
