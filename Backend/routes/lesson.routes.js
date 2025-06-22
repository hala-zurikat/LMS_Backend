import express from "express";
import lessonController from "../controllers/lesson.controllers.js";

const router = express.Router();

router.get("/module/:module_id", lessonController.getByModuleId);

router.get("/", lessonController.getAll);
router.get("/:id", lessonController.getById);
router.post("/", lessonController.create);
router.put("/:id", lessonController.update);
router.delete("/:id", lessonController.delete);

export default router;
