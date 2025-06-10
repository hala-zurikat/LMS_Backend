import Joi from "joi";

const quizSchema = Joi.object({
  lesson_id: Joi.number().integer().positive().required(),
  question: Joi.string().required(),
  options: Joi.array().items(Joi.string()).min(2).required(),
  correct_answer: Joi.string().required(),
  max_score: Joi.number().integer().min(1).default(10),
});

export function validateQuiz(data) {
  return quizSchema.validate(data, { abortEarly: false });
}
