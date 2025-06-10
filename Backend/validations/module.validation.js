import Joi from "joi";

export const moduleSchema = Joi.object({
  course_id: Joi.number().integer().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().allow("", null),
  order: Joi.number().integer().required(),
});
