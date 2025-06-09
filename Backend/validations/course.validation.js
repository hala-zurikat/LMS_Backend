import Joi from "joi";
export const createCourseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  instructor_id: Joi.number().integer().positive().required(),
  category_id: Joi.number().integer().positive().required(),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10),
  instructor_id: Joi.number().integer().positive(),
  category_id: Joi.number().integer().positive(),
});
