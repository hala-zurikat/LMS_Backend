import Joi from "joi"

export const createLessonSchema=Joi.object({
  module_id: Joi.number().integer().required(),
  title:Joi.string().min(3).max(255).required(),
  content_type: Joi.string().valid("video", "article", "quiz").required(),
  content_url: Joi.string().uri().required(),
  duration: Joi.number().integer().min(1).required(),
  order: Joi.number().integer().min(1).required(),
  is_free: Joi.boolean().required()
});

export const updateLessonSchema = Joi.object({
  module_id: Joi.number(),
  title: Joi.string(),
  content_type: Joi.string().valid("video", "article", "quiz"),
  content_url: Joi.string().uri(),
  duration: Joi.number().positive(),
  order: Joi.number(),
  is_free: Joi.boolean(),
});