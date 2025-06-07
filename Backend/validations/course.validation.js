import Joi from "joi";

export const courseSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  instructor_id: Joi.number().integer().positive().required(),
  category: Joi.string().required(),
  created_at: Joi.date().iso().required(),
  updated_at: Joi.date().iso().required(),
});
