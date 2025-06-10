import express from "express";
import { CategoryController } from "../controllers/category.controllers.js";

const router = express.Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;
