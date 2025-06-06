import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(6).max(50).required(),
  email: Joi.string().email().required(),
  avatar: Joi.string().uri().optional(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("student", "admin", "instructor").default("student"),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(6).max(50),
  email: Joi.string().email(),
  avatar: Joi.string().uri(),
  password: Joi.string().min(8),
  role: Joi.string().valid("student", "admin", "instructor"),
  is_active: Joi.boolean(),
});
