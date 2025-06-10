import express from "express";
import { ModuleController } from "../controllers/module.controllers.js";

const router = express.Router();

router.get("/", ModuleController.getAll);
router.get("/:id", ModuleController.getById);
router.post("/", ModuleController.create);
router.put("/:id", ModuleController.update);
router.delete("/:id", ModuleController.delete);

export default router;
