import express from "express";
import {
  deleteModuleController,
  modulesByCourseId,
  getModulesList,
  editModule,
  newModule,
} from "../controllers/module.controllers.js";
const router = express.Router();

router.get("/", getModulesList);
router.post("/", newModule);
router.put("/:id", editModule);
router.get("/coures/:id", modulesByCourseId);
router.delete("/:id", deleteModuleController);
export default router;
