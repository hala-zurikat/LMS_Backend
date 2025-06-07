import express from "express";
import * as AssignmentController from "../controllers/assignment.controllers.js";

const router = express.Router();

router.get("/", AssignmentController.getAll);
router.get("/:id", AssignmentController.getById);
router.post("/", AssignmentController.create);
router.put("/:id", AssignmentController.update);
router.delete("/:id", AssignmentController.remove);

export default router;
