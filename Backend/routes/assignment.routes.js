import express from "express";
import assignmentController from "../controllers/assignment.controllers.js";

const router = express.Router();

router.get("/", assignmentController.getAll);
router.get("/user/:user_id", assignmentController.getByUserId);
router.get("/lesson/:lesson_id", assignmentController.getByLessonId);

router.get(
  "/instructor/:id",
  assignmentController.getAssignmentsWithSubmissionsByInstructor
);

router.get("/:id", assignmentController.getById);
router.post("/", assignmentController.create);
router.put("/:id", assignmentController.update);
router.delete("/:id", assignmentController.delete);

export default router;
