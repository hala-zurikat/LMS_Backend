import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  password_hash: Joi.string().optional(),
  role: Joi.string().valid("student", "instructor", "admin").required(),
  oauth_provider: Joi.string().optional().allow(null),
  oauth_id: Joi.string().optional().allow(null),
  is_active: Joi.boolean().optional(),
  avatar: Joi.string().uri().optional().allow(null),
});

export const userIdSchema = Joi.number().integer().positive().required();
