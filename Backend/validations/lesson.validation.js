import Joi from "joi";

export const lessonSchema = Joi.object({
  module_id: Joi.number().integer().positive().required(),
  title: Joi.string().required(),
  content_type: Joi.string().valid("video", "quiz", "text").required(),
  content_url: Joi.string().uri().allow(null, ""),
  duration: Joi.number().integer().min(0).default(0),
  order: Joi.number().integer().positive().required(),
  is_free: Joi.boolean().default(false),
});
