import express from "express";
import {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  removeCategory,
} from "../controllers/category.controllers.js";

const router = express.Router();

router.post("/", addCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.put("/:id", editCategory);
router.delete("/:id", removeCategory);

export default router;
