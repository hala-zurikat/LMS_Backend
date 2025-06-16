import express from "express";
import { EnrollmentController } from "../controllers/enrollment.controllers.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.get("/", EnrollmentController.getAll);
router.get("/me", authenticate, EnrollmentController.getMyEnrollments);
router.get("/:id", EnrollmentController.getById);
router.post("/", EnrollmentController.create);
router.put("/:id", EnrollmentController.update);
router.delete("/:id", EnrollmentController.delete);

export default router;
