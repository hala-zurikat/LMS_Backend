import Joi from "joi";

export const courseSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(null, ""),
  instructor_id: Joi.number().integer().required(),
  category_id: Joi.number().integer().allow(null),
  price: Joi.number().precision(2).min(0).allow(null),
  thumbnail_url: Joi.string().uri().allow(null, ""),
  is_published: Joi.boolean().allow(null),
  is_approved: Joi.boolean().allow(null),
});
