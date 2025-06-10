import Joi from "joi";

export const submissionSchema = Joi.object({
  assignment_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  submission_url: Joi.string().uri().required(),
  submitted_at: Joi.date().iso().optional(),
  grade: Joi.number().integer().min(0).optional().allow(null),
  feedback: Joi.string().optional().allow(null, ""),
});
