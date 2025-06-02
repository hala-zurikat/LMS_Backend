import expree from "express";
import {
  fetchAllLessons,
  fetchLesson,
  addLesson,
  editLesson,
  removeLesson,
} from "../controllers/lesson.controllers.js";
const router = expree.Router();

router.get("/", fetchAllLessons);
router.get("/:id", fetchLesson);
router.post("/", addLesson);
router.put("/:id", editLesson);
router.delete("/:id", removeLesson);

export default router;
