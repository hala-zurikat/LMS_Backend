import Joi from "joi";

export const createModuleSchema = Joi.object({
  course_id: Joi.number().integer().required(),
  title: Joi.string().min(8).max(100).required(),
  description: Joi.string().allow("", null),
  order: Joi.number().integer().min(1).required(),
});

export const updateModuleSchema = Joi.object({
  course_id: Joi.number().integer(),
  title: Joi.string().min(8).max(100),
  description: Joi.string().allow("", null),
  order: Joi.number().integer().min(1),
});
