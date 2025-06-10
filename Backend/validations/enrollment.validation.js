// validations/enrollmentValidation.js
import Joi from "joi";

export const enrollmentSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  course_id: Joi.number().integer().required(),
  enrolled_at: Joi.date().optional(),
  completed_at: Joi.date().allow(null),
  progress: Joi.number().integer().min(0).max(100).optional(),
});
