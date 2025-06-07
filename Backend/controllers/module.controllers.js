import {
  createModuleSchema,
  updateModuleSchema,
} from "../validations/module.validation.js";

import {
  createModule,
  updateModule,
  getAllModules,
  getModulesByCourseId,
  deleteModule,
} from "../models/module.models.js";

// Create new module
export const newModule = async (req, res) => {
  try {
    const { error } = createModuleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { course_id, title, description, order } = req.body;
    const addedModule = await createModule({
      course_id,
      title,
      description,
      order,
    });

    res.status(201).json(addedModule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update existing module
export const editModule = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid module ID" });
    }

    const { error } = updateModuleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { course_id, title, description, order } = req.body;

    const updatedModule = await updateModule({
      id,
      course_id,
      title,
      description,
      order,
    });

    res.status(200).json(updatedModule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all modules
export const getModulesList = async (req, res) => {
  try {
    const modules = await getAllModules();
    if (!modules || modules.length === 0) {
      return res.status(404).json({ error: "No modules found" });
    }
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get modules by course ID
export const modulesByCourseId = async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const modules = await getModulesByCourseId(courseId);
    if (!modules || modules.length === 0) {
      return res
        .status(404)
        .json({ error: "No modules found for this course" });
    }

    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a module
export const deleteModuleController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid module ID" });
    }

    const deletedModule = await deleteModule(id);
    if (!deletedModule) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.status(200).json({
      message: "Module deleted successfully",
      deletedModule,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
