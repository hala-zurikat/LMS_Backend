import Joi from "joi";

export const enrollmentSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  course_id: Joi.number().integer().positive().required(),
  enrolled_at: Joi.date().required(),
  completed_at: Joi.date().allow(null),
  progress: Joi.number().min(0).max(100).required(),
});
