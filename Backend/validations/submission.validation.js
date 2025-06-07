import Joi from "joi";

export const submissionSchema = Joi.object({
  assignment_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  submission_url: Joi.string().uri().required(),
  submitted_at: Joi.date().iso().required(),
  grade: Joi.number().min(0).max(100).optional().allow(null),
});
