import Joi from "joi";

export const assignmentSchema = Joi.object({
  lesson_id: Joi.number().integer().positive().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  deadline: Joi.date().iso().allow(null),
  max_score: Joi.number().integer().min(1).default(100),
});
