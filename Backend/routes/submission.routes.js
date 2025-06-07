import express from "express";
import * as SubmissionController from "../controllers/submission.controllers.js";

const router = express.Router();

router.get("/", SubmissionController.getAll);
router.get("/:id", SubmissionController.getById);
router.post("/", SubmissionController.create);
router.put("/:id", SubmissionController.update);
router.delete("/:id", SubmissionController.remove);

export default router;
