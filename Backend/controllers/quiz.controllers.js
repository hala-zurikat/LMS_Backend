import {
  allQuizzes,
  createQuizz,
  updateQuizz,
  getQuizzesByLessonId,
  getQuizzesById,
  deleteQuizz,
} from "../models/quiz.models.js";
import {
  createQuizzSchema,
  updateQuizzSchema,
} from "../validations/quiz.validation.js";

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await allQuizzes();
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error getting all quizzes:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get quiz by ID
export const getQuizById = async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id);

  if (isNaN(quizId) || quizId <= 0) {
    return res.status(400).json({ message: "Invalid quiz ID." });
  }

  try {
    const quiz = await getQuizzesById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }
    return res.status(200).json(quiz);
  } catch (error) {
    console.error("Error getting quiz by ID:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get quizzes by lesson ID
export const getQuizzesByLesson = async (req, res) => {
  const { lesson_id } = req.params;
  const lessonId = parseInt(lesson_id);

  if (isNaN(lessonId) || lessonId <= 0) {
    return res.status(400).json({ message: "Invalid lesson ID." });
  }

  try {
    const quizzes = await getQuizzesByLessonId(lessonId);
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error getting quizzes by lesson ID:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Create new quiz
export const addQuiz = async (req, res) => {
  const { error } = createQuizzSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { lesson_id, question, options, correct_answer } = req.body;

  try {
    const newQuiz = await createQuizz(
      lesson_id,
      question,
      options,
      correct_answer
    );
    return res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update quiz
export const editQuiz = async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id);

  if (isNaN(quizId) || quizId <= 0) {
    return res.status(400).json({ message: "Invalid quiz ID." });
  }

  const { error } = updateQuizzSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedQuiz = await updateQuizz(quizId, req.body);
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found to update." });
    }

    return res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Delete quiz
export const removeQuiz = async (req, res) => {
  const { id } = req.params;
  const quizId = parseInt(id);

  if (isNaN(quizId) || quizId <= 0) {
    return res.status(400).json({ message: "Invalid quiz ID." });
  }

  try {
    const deletedQuiz = await deleteQuizz(quizId);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found to delete." });
    }

    return res
      .status(200)
      .json({ message: "Quiz deleted successfully.", quiz: deletedQuiz });
  } catch (error) {
    console.error("Error deleting quiz:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
