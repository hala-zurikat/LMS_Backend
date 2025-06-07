import Joi from "joi";

//Quizzes (id, lesson_id, question, options, correct_answer)

export const createQuizzSchema = Joi.object({
  lesson_id: Joi.number().required(),
  question: Joi.string().required(),
  options: Joi.array().items(Joi.string()).required(),
  correct_answer: Joi.string().required(),
});
export const updateQuizzSchema = Joi.object({
  lesson_id: Joi.number(),
  question: Joi.string(),
  options: Joi.array().items(Joi.string()),
  correct_answer: Joi.string(),
});
