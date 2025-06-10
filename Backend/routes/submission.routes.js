import express from "express";
import submissionController from "../controllers/submission.controllers.js";

const router = express.Router();

router.get("/", submissionController.getAll);
router.get("/:id", submissionController.getById);
router.get(
  "/assignment/:assignment_id",
  submissionController.getByAssignmentId
);
router.get("/user/:user_id", submissionController.getByUserId);
router.post("/", submissionController.create);
router.put("/:id", submissionController.update);
router.delete("/:id", submissionController.delete);

export default router;
