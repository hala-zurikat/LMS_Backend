import Joi from "joi";

export const assignmentSchema = Joi.object({
  lesson_id: Joi.number().integer().positive().required(),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("").optional(),
  deadline: Joi.date().iso().required(),
});
